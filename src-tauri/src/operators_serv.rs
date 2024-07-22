use std::io::{self, BufReader, BufRead, Write};
use std::collections::HashMap;
use std::fs::File;
use std::path::PathBuf;

use toml::Value;


use crate::utils::u_serv::normalize_name;
use crate::file_sys_serv::{check_path, init_file};
use crate::store_app::OPERATORS_LIST_FILE_NAME;


pub const OPERATOR_ID_FILENAME: &str = "operator_id.txt";

#[derive(serde::Serialize)]
struct OperatorRecord {
    name: String,
    values: Vec<String>,
}

impl OperatorRecord {
    fn new(name: &str, values: &[String]) -> Self {
        OperatorRecord {
            name: name.to_string(),
            values: values.to_vec(),
        }
    }
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

pub fn update_operators_file(new_nick: &str) -> std::io::Result<()> {
    let normalized_nick = normalize_name(new_nick);
    let operators_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    let mut records = read_operators_file(OPERATORS_LIST_FILE_NAME)?;

    let new_record = OperatorRecord::new(&normalized_nick, &Vec::new());
    records.insert(new_record.name.clone(), new_record.values);

    let mut vec_of_tuples: Vec<(String, Vec<String>)> = records.into_iter().collect();
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


pub fn recognize_card(drivepath_str: &PathBuf) -> io::Result<()> {
    let dcim_path  = drivepath_str.join("DCIM");
    let misc_path  = drivepath_str.join("MISC");
    let card_id_path = misc_path.join("card");
    let operator_id_path = misc_path.join(OPERATOR_ID_FILENAME);

    if check_path(&dcim_path) == false { return Err(io::Error::new(io::ErrorKind::NotFound, "No DCIM")); };
    if check_path(&card_id_path) {
        init_file(&operator_id_path);
    }
    Ok(())
}