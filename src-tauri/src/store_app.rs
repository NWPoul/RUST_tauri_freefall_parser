use redux_rs::Store;
use std::path::PathBuf;

use crate::commands::main_workflow_for_videofiles;
use crate::file_sys_serv::{
    init_file,
    update_toml_field,
};
use crate::operators_serv::{read_operators_file, update_operators_file};
use crate::utils::u_serv::normalize_name;




pub const OPERATORS_LIST_FILE_NAME: &str = "operators_list.toml";


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
        rt.block_on(main_workflow_for_videofiles(&new_drive));
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
            let normalized_name = normalize_name(&payload);
            if state.nick_list.contains(&normalized_name) {
                println!("Nickname '{}' already exists.", normalized_name);
                return  state;
            }
            let mut new_nick_list = state.nick_list.clone();
            new_nick_list.extend([normalized_name.clone()]);
            new_nick_list.sort();

            _ = update_operators_file(&normalized_name);

            State{
                nick_list: new_nick_list,
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










