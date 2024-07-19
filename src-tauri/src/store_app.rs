use redux_rs::Store;
use std::path::PathBuf;

use crate::commands::on_open_files_for_parse;
use crate::file_sys_serv::{
    init_file,
    update_toml_field,
};




use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
// use serde::Deserialize;


// #[derive(Debug, Deserialize)]
// struct OperatorsList {
//     operators: HashMap<String, String>,
// }






const OPERATORS_LIST_FILE_NAME: &str = "operators_list.toml";


pub fn init_operators_list_file() {
    let config_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    init_file(&config_file_path);
}

pub fn update_operators_list<V: serde::Serialize>(
    nick: &str,
    field_value: V,
) -> Result<(), Box<dyn std::error::Error>> {
    let config_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    update_toml_field(
        &config_file_path,
        nick,
        field_value,
    )
}


#[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
pub struct State {
    pub cur_dir   : PathBuf,
    pub flight    : u8,
    pub add_flight: bool,
    pub cur_nick  : Option<String>,
    pub add_nick  : bool,
    pub nick_list : Vec<String>,
    // pub cur_date  : String,
}

impl Default for State { fn default() -> Self {
    let mut state = State{
        cur_dir    : ".".into(),
        flight     : 1,
        add_flight : false,
        cur_nick   : None,
        add_nick   : false,
        nick_list  : Vec::new(),
        // cur_date   : "".into(),
    };

    match read_operators_file(OPERATORS_LIST_FILE_NAME) {
        Ok(list) => state.nick_list = list.keys().cloned().collect(),
        Err(_) => println!("No operators"),
    }

    state
}}


#[derive(Debug)]
pub enum Action {
    UpdState(State),
    EventNewDrive(PathBuf),
    UpdCurDir(PathBuf),
    UpdFlight(u8),
    UpdCurNick(Option<String>),
    AddNewNick(String),
    UpdNickList(Vec<String>),
    ToggleAddFlight(bool),
    ToggleAddNick(bool),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



#[allow(non_snake_case)]
pub mod SELECTORS {
    use std::path::PathBuf;
    use super::State;
    use crate::create_selector;

    create_selector!(); // ALLState
    create_selector!( CurDir,      cur_dir   , PathBuf       , clone = true );
    create_selector!( Flight,      flight    , u8 );
    create_selector!( IsAddFlight, add_flight, bool );
    create_selector!( CurNick,     cur_nick  , Option<String>, clone = true );
    create_selector!( IsAddNick,   add_nick  , bool );
    create_selector!( NickList,    nick_list , Vec<String>   , clone = true );
}



pub fn on_new_drive_event(new_drive: PathBuf) {
    println!("\nNEW DRIVE PLUGGED IN: {:?}", new_drive);
    let rt = tokio::runtime::Runtime::new().unwrap();
    std::thread::spawn(move || {
        rt.block_on(on_open_files_for_parse(&new_drive));
    });
}



fn reducer(state: State, action: Action) -> State {
    match action {
        Action::UpdState(payload)        => payload,
        Action::EventNewDrive(payload)   => {
            on_new_drive_event(payload);
            state
        },
        Action::UpdCurDir(payload)       => State{cur_dir   : payload, ..state},
        Action::ToggleAddFlight(payload) => State{add_flight: payload, ..state},
        Action::UpdFlight(payload)       => State{flight    : payload, add_flight: true, ..state},
        Action::UpdCurNick(payload)      => {match payload {
            Some(nick) => State{ cur_nick:Some(nick), add_nick:true , ..state },
            None       => State{ cur_nick:None      , add_nick:false, ..state },
        }},
        Action::ToggleAddNick(payload)   => State{add_nick  : payload, ..state},
        Action::UpdNickList(payload)     => State{nick_list : payload, ..state},
        Action::AddNewNick(payload)      => {
            if state.nick_list.contains(&payload) {
                println!("Nickname '{}' already exists.", payload);
                return  state;
            }
            let mut new_nick_list = state.nick_list.clone();
            new_nick_list.extend([payload.clone()]);
            new_nick_list.sort();

            _ = update_operators_file(&payload);

            State{
                nick_list: new_nick_list,
                cur_nick : Some(payload),
                add_nick : true,
                ..state}
        },
    }
}


pub fn get_store() -> Store<State, Action, fn(State, Action) -> State> {
    let initial_state = State::default();
    Store::new_with_state(reducer, initial_state)
}














use std::io::{self, BufReader, BufRead};
use toml::Value;



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


fn read_operators_file(file_path: &str) -> Result<HashMap<String, Vec<String>>, io::Error> {
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
                    table.insert(key.clone(), values);
                }
            }
        }
    }

    Ok(table)
}

pub fn update_operators_file(new_nick: &str) -> std::io::Result<()> {
    let operators_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    let mut records = read_operators_file(OPERATORS_LIST_FILE_NAME)?;

    let new_record = OperatorRecord::new(new_nick, &Vec::new());
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