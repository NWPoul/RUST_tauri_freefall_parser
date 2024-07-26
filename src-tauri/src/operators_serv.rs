use std::io::{self, BufReader, BufRead, Write};
use std::collections::HashMap;
use std::fs::File;
use std::path::PathBuf;

use toml::Value;


use crate::utils::u_serv::normalize_name;
use crate::file_sys_serv::{check_path, extract_drive_path, init_file, read_first_non_empty_line};
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



pub fn generate_operator_id() -> String {
    let now = std::time::SystemTime::now();
    let since_the_epoch = now.duration_since(std::time::SystemTime::UNIX_EPOCH)
        .expect("Time went backwards");
    let timestamp_nanos = since_the_epoch.as_nanos();
    timestamp_nanos.to_string()
}


pub fn find_by_nick_inhash(operators_list: &OperatorsList, nick: &str) -> Option<IdList> {
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

// fn find_operator_by_id_invec(records: &[OperatorRecord], id: &str) -> Option<OperatorRecord> {
//     for record in records {
//         if record.values.contains(&id.to_string()) {
//             return Some(record.clone());
//         }
//     }
//     None
// }


fn get_id_from_drive(id_path: &PathBuf) -> Option<String> {
    let id: String  = if check_path(id_path) {
        let id_found = read_first_non_empty_line(id_path);
        dbg!("id from drive", id_path, &id_found);
        id_found.unwrap_or("".into()).into()
    } else {
        dbg!("WRONG id_path!", id_path);
        "".into()
    };
    if id.len() < 10 {
        return None
    }
    Some(id)
}

fn get_dcim_path(path: &PathBuf) -> Option<PathBuf> {
    if let Some(drive_path) = extract_drive_path(path) {
        return Some(drive_path.join("DCIM"));
    };
    None
}

fn get_misk_path(path: &PathBuf) -> Option<PathBuf> {
    if let Some(drive_path) = extract_drive_path(path) {
        return Some(drive_path.join("MISC"));
    };
    dbg!("misc_path not found", path);
    None
}

fn get_operator_id_path(path: &PathBuf) -> Option<PathBuf>{
    if let Some(misc_path) = get_misk_path(path) {
        return Some(misc_path.join(OPERATOR_ID_FILENAME));
    };
    dbg!("operator_id_path not found", path);
    None
}
pub fn get_operator_id(path: &PathBuf) -> Option<String> {
    if let Some(operator_id_path) = get_operator_id_path(path) {
        dbg!("operator_id_path found", path, &operator_id_path);
        return get_id_from_drive(&operator_id_path);
    };
    dbg!("operator_id not found", path);
    None
}
fn get_card_id(path: &PathBuf) -> Option<String> {
    if let Some(misc_path) = get_misk_path(path) {
        return get_id_from_drive(&misc_path.join("card"));
    };
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

pub fn delete_card_from_operators_file(card_id: &str) -> std::io::Result<()> {
    let operators_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    let mut cur_records = read_operators_file(OPERATORS_LIST_FILE_NAME)?;

    let mut target_operator_record = match find_operator_by_id_inhash(&cur_records, card_id) {
        Some(v) => v.clone(),
        None => {
            return Err(io::Error::new(io::ErrorKind::NotFound, "ID_DONT_EXIST ({})"));
        },
    };

    target_operator_record.1.retain(|s| s != card_id);

    let target_id_list = cur_records.get_mut(&target_operator_record.0.clone()).unwrap();
    *target_id_list = target_operator_record.1.clone();


    let mut vec_of_tuples: Vec<(String, Vec<String>)> = cur_records.into_iter().collect();
    vec_of_tuples.sort_by_key(|k| k.0.clone());
    dbg!("DELETENG CARD", &card_id, &target_operator_record, &vec_of_tuples);

    save_tuples_to_file(vec_of_tuples, &operators_file_path)
}

pub fn update_operators_file(nick: &str, new_id: &str) -> std::io::Result<()> {
    let normalized_nick = normalize_name(nick);
    let use_generated_id = new_id.is_empty();

    let operator_id = if use_generated_id {
        generate_operator_id()
    } else {
        new_id.to_string()
    };

    let operators_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    let mut cur_records = read_operators_file(OPERATORS_LIST_FILE_NAME)?;

    if let Some(_record) = find_operator_by_id_inhash(&cur_records, &operator_id) {
        return Err(io::Error::new(io::ErrorKind::AlreadyExists, "ID_EXIST ({})"));
    }

    let updated_id_list: Vec<String> = if let Some(ref mut id_list) = find_by_nick_inhash(&cur_records, nick) {
        id_list.push(operator_id.to_string());
        id_list.clone()
    } else {
        vec![operator_id.to_string()]
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


pub fn recognize_card(input_path: &PathBuf) -> io::Result<String> {

    if let None = get_dcim_path(input_path) {
        println!("NO_DCIM");
        return Err(io::Error::new(io::ErrorKind::NotFound, "NO_DCIM"));
    }

    let card_serial_number = get_card_id(input_path);
    dbg!(&card_serial_number);

    let operator_id = match get_operator_id(input_path) {
        Some(id) => {
            dbg!(&id);
            return Ok(id);
        },
        None => match card_serial_number {
            Some(id) => id,
            None     => generate_operator_id(),
        },
    };

    if let Some(operator_id_path) = get_operator_id_path(input_path) {
        init_file(
            &operator_id_path,
            &operator_id
        )
    } else {
        return Err(io::Error::new(io::ErrorKind::InvalidInput, "NOT_DISK_DRIVE"));
    }

    Ok(operator_id)
}

