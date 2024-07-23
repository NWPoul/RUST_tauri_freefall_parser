use std::io::{self, BufReader, BufRead, Write};
use std::collections::HashMap;
use std::fs::File;
use std::path::PathBuf;

use toml::Value;


use crate::utils::u_serv::normalize_name;
use crate::file_sys_serv::{check_path, init_file, read_first_non_empty_line};
use crate::store_app::OPERATORS_LIST_FILE_NAME;


pub const OPERATOR_ID_FILENAME: &str = "operator_id.txt";

#[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
pub struct OperatorRecord {
    pub name: String,
    pub values: Vec<String>,
}

impl OperatorRecord {
    fn new(name: &str, values: &[String]) -> Self {
        OperatorRecord {
            name: name.to_string(),
            values: values.to_vec(),
        }
    }
}


type IdList = Vec<String>;
type OperatorsList = HashMap<String, IdList>;



pub fn get_operator_id() -> String {
    let now = std::time::SystemTime::now();
    let since_the_epoch = now.duration_since(std::time::SystemTime::UNIX_EPOCH)
        .expect("Time went backwards");
    let timestamp_nanos = since_the_epoch.as_nanos();
    timestamp_nanos.to_string()
}


fn find_by_nick(operators_list: &OperatorsList, nick: &str) -> Option<IdList> {
    operators_list.get(nick).map(|list| list.clone())
}

pub fn find_operator_by_id_inhash(operators_list: &OperatorsList, id: &str) -> Option<(String, IdList)> {
    for (nickname, ids) in operators_list.iter() {
        if ids.contains(&id.to_string()) {
            return Some((nickname.to_string(), ids.to_owned()));
        }
    }
    None
}

pub fn find_operator_by_id_invec(records: &[OperatorRecord], id: &str) -> Option<OperatorRecord> {
    for record in records {
        if record.values.contains(&id.to_string()) {
            return Some(record.clone());
        }
    }
    None
}


pub fn read_operators_file(file_path: &str) -> Result<HashMap<String, Vec<String>>, io::Error> {
    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let mut table: HashMap<String, Vec<String>> = HashMap::new();

    for line in reader.lines() {
        let line = line?;
        if line.trim().is_empty() {
            continue;
        }
        let value = toml::from_str(&line)?;
        if let Value::Table(ref t) = value {
            for (key, sub_value) in t {
                if let Value::Array(ref vals) = *sub_value {
                    let values = vals.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect::<Vec<String>>();
                    table.insert(
                        normalize_name(&key.clone()),
                        values
                    );
                }
            }
        }
    }

    Ok(table)
}

pub fn update_operators_file(new_nick: &str, new_id: &str) -> std::io::Result<()> {
    let normalized_nick = normalize_name(new_nick);
    let new_id: &str = if new_id.is_empty() {
        &get_operator_id()
    } else { new_id };

    let operators_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    let mut cur_records = read_operators_file(OPERATORS_LIST_FILE_NAME)?;

    if let Some(_record) = find_operator_by_id_inhash(&cur_records, new_id) {
        return Err(io::Error::new(io::ErrorKind::AlreadyExists, "ID_EXIST ({})"));
    }

    let updated_id_list: Vec<String> = if let Some(ref mut id_list) = find_by_nick(&cur_records, new_nick) {
        id_list.push(new_id.to_string());
        id_list.clone()
    } else {
        vec![new_id.to_string()]
    };

    let new_record = OperatorRecord::new(
        &normalized_nick,
        &updated_id_list
    );
    cur_records.insert(new_record.name.clone(), new_record.values);

    let mut vec_of_tuples: Vec<(String, Vec<String>)> = cur_records.into_iter().collect();
    vec_of_tuples.sort_by_key(|k| k.0.clone());
    dbg!(&vec_of_tuples);

    save_tuples_to_file(vec_of_tuples, &operators_file_path)
}


fn save_tuples_to_file(tuples: Vec<(String, Vec<String>)>, file_path: &PathBuf) -> std::io::Result<()> {
    let mut toml_content = String::new();

    for (key, values) in tuples {
        let array_value = if !values.is_empty() {
            match Value::try_from(values.clone()) {
                Ok(value) => value,
                Err(_) => continue,
            }
        } else {
            Value::Array(Vec::new())
        };

        toml_content.push_str(&format!("\"{}\" = {}\n", key, array_value.to_string()));
    }

    let mut file = File::create(file_path)?;
    file.write_all(toml_content.as_bytes())?;

    Ok(())
}


pub fn recognize_card(drivepath_str: &PathBuf) -> io::Result<String> {
    let dcim_path  = drivepath_str.join("DCIM");
    dbg!(&drivepath_str, &dcim_path);
    let misc_path  = drivepath_str.join("MISC");
    let card_id_path = misc_path.join("card");
    let operator_id_path = misc_path.join(OPERATOR_ID_FILENAME);

    if check_path(&dcim_path) == false {
        println!("NO_DCIM");
        return Err(io::Error::new(io::ErrorKind::NotFound, "NO_DCIM"));
    }

    if check_path(&misc_path) == false {
        let new_id = get_operator_id();
        init_file(&operator_id_path, &new_id);
        return Ok(new_id);
    }

    let card_serial_number: String = if check_path(&card_id_path) {
        read_first_non_empty_line(&card_id_path).unwrap_or("".into()).into()
    } else {"".into()};

    let mut operator_id: String  = if check_path(&operator_id_path) {
        read_first_non_empty_line(&operator_id_path).unwrap_or("".into()).into()
    } else {"".into()};


    if operator_id.len() > 0 {
        return Ok(operator_id);
    }

    if card_serial_number.len() > 0 {
        operator_id = card_serial_number;
    } else {
        operator_id = get_operator_id();
    }

    init_file(&operator_id_path, &operator_id);

    Ok(operator_id)
}