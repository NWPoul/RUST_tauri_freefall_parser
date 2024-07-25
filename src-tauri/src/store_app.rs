use redux_rs::Store;
use std::collections::HashMap;
use std::path::PathBuf;

use crate::commands::{main_workflow_for_videofiles, tauri_show_msg};
use crate::file_sys_serv::{
    init_file,
    update_toml_field,
    get_src_path_for_ext_drive,
};

use crate::operators_serv::{
    find_by_nick_inhash, find_operator_by_id_inhash, find_operator_by_id_invec, generate_operator_id, read_operators_file, recognize_card, update_operators_file, OperatorRecord
};

use crate::utils::u_serv::normalize_name;




pub const OPERATORS_LIST_FILE_NAME: &str = "operators_list.toml";

fn convert_to_operator_records(input_map: HashMap<String, Vec<String>>) -> Vec<OperatorRecord> {
    input_map.into_iter().map(|(name, values)| {
        OperatorRecord {
            name: name.clone(),
            values: values.clone(),
        }
    }).collect()
}


pub fn init_operators_list_file() {
    let config_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    init_file(&config_file_path, "");
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


#[derive(Debug, Clone, PartialEq, serde::Serialize)]
pub struct State {
    pub cur_dir   : PathBuf,
    pub flight    : u8,
    pub add_flight: bool,
    pub cur_nick  : Option<String>,
    pub add_nick  : bool,
    pub operators_list: HashMap<String, Vec<String>>,
    // pub cur_date  : String,
}

impl Default for State { fn default() -> Self {
    let mut state = State{
        cur_dir    : ".".into(),
        flight     : 1,
        add_flight : false,
        cur_nick   : None,
        add_nick   : false,
        operators_list: HashMap::new(),
    };

    match read_operators_file(OPERATORS_LIST_FILE_NAME) {
        // Ok(list) => state.operators_list = convert_to_operator_records(list),
        Ok(list) => state.operators_list = list,
        Err(_)   => println!("No operators"),
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
    UpdOperatorsList(HashMap<String, Vec<String>>),
    ToggleAddFlight(bool),
    ToggleAddNick(bool),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



#[allow(non_snake_case)]
pub mod SELECTORS {
    use std::{collections::HashMap, path::PathBuf};
    use super::State;
    use crate::create_selector;// operators_serv::OperatorRecord};

    create_selector!( CurDir,        cur_dir   , PathBuf         , clone = true );
    create_selector!( Flight,        flight    , u8   );
    create_selector!( IsAddFlight,   add_flight, bool );
    create_selector!( CurNick,       cur_nick  , Option<String>  , clone = true );
    create_selector!( IsAddNick,     add_nick  , bool );
    create_selector!( OperatorsList, operators_list, HashMap<String, Vec<String>>, clone = true );
}



pub fn on_new_drive_event(new_drive: &PathBuf) {
    println!("\nNEW DRIVE PLUGGED IN: {:?}", new_drive);
    let src_path = get_src_path_for_ext_drive(&new_drive);

    let rt = tokio::runtime::Runtime::new().unwrap();
    std::thread::spawn(move || {
        rt.block_on(main_workflow_for_videofiles(&src_path));
    });
}


fn reducer(state: State, action: Action) -> State {
    match action {
        Action::UpdState(payload)        => payload,
        Action::EventNewDrive(payload)   => {
            let mut new_state = state.clone();
            if let Ok(operator_id) = recognize_card(&payload) {
                match find_operator_by_id_inhash(&state.operators_list, &operator_id) {
                    Some(operator) => {
                        tauri_show_msg("SD Card recognized!", &operator.0);
                        new_state.cur_nick = Some(operator.0);
                        new_state.add_nick = true;
                    },
                    None => println!("SD Card NEW OPERATOR {}", &operator_id)//tauri_show_msg("SD Card NEW OPERATOR", &operator_id)
                }
            } else {
                // tauri_show_msg("SD Card plugged!", "not GO PRO card");
            }

            on_new_drive_event(&payload);
            new_state
        },
        Action::UpdCurDir(payload)        => State{cur_dir   : payload, ..state},
        Action::ToggleAddFlight(payload)  => State{add_flight: payload, ..state},
        Action::UpdFlight(payload)        => State{flight    : payload, add_flight: true, ..state},
        Action::UpdCurNick(payload)       => {match payload {
            Some(nick) => State{ cur_nick:Some(nick), add_nick:true , ..state },
            None       => State{ cur_nick:None      , add_nick:false, ..state },
        }},
        Action::ToggleAddNick(payload)    => State{add_nick  : payload, ..state},
        Action::UpdOperatorsList(payload) => State{operators_list : payload, ..state},
        Action::AddNewNick(payload)       => {
            let normalized_name = normalize_name(&payload);
            if let Some(operator_rec) = find_by_nick_inhash(&state.operators_list, &normalized_name) {
                println!("Nickname '{}' already exists.", normalized_name);
                return  state;
            }
            // dbg!(&normalized_name);
            let mut new_operators_list = state.operators_list.clone();
            let new_id = generate_operator_id();
            new_operators_list.entry(normalized_name.clone())
                .or_insert_with(Vec::new)
                .push(new_id.clone());

            _ = update_operators_file(&normalized_name, &new_id);

            State{
                operators_list: new_operators_list,
                cur_nick : Some(normalized_name),
                add_nick : true,
                ..state}
        },
    }
}


pub fn get_store() -> Store<State, Action, fn(State, Action) -> State> {
    let initial_state = State::default();
    Store::new_with_state(reducer, initial_state)
}










