use redux_rs::{Store};

use std::{
    collections::HashMap,
    path::PathBuf,
};


use crate::utils::u_serv::normalize_name;

use crate::telemetry_analysis::FileParsingResults;

use crate::file_sys_serv::{
    init_file,
    get_src_path_for_ext_drive,
};

use crate::operators_serv::{
    delete_card_from_operators_file,
    find_by_nick_inhash,
    find_operator_by_id_inhash,
    generate_operator_id,
    read_operators_file,
    recognize_card,
    update_operators_file,
    OperatorRecord,
};

use crate::commands::{
    DEF_WINDOW_WIDTH,
    LARGE_WINDOW_WIDTH,
    on_choose_video_for_parsing,
    set_window_width,
};





pub const OPERATORS_LIST_FILE_NAME: &str = "operators_list.toml";



pub fn init_operators_list_file() {
    let config_file_path: PathBuf = OPERATORS_LIST_FILE_NAME.into();
    init_file(&config_file_path, "");
}


#[derive(Debug, Clone, PartialEq, serde::Serialize)]
pub struct State {
    pub cur_dir    : PathBuf,
    pub flight     : u8,
    pub add_flight : bool,
    pub cur_nick   : Option<String>,
    pub add_nick   : bool,
    pub auto_play  : bool,
    pub groups_list   : Vec<String>,
    pub operators_list: HashMap<String, Vec<String>>,
    pub chosen_files_data: Option<FileParsingResults>,
}

impl Default for State { fn default() -> Self {
    let mut state = State{
        cur_dir    : ".".into(),
        flight     : 1,
        add_flight : false,
        cur_nick   : None,
        add_nick   : false,
        auto_play  : true,
        groups_list   : Vec::new(),
        operators_list: HashMap::new(),
        chosen_files_data: None,
    };

    if let Ok(list) = read_operators_file(OPERATORS_LIST_FILE_NAME) {
        state.operators_list = list
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
    DeleteCardIdFromList(String),
    UpdOperatorsList(OperatorRecord),
    ToggleAddFlight(bool),
    ToggleAddNick(bool),
    ToggleAutoPlay(bool),
    UpdChosenFilesData(Option<FileParsingResults>),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



#[allow(non_snake_case)]
pub mod SELECTORS {
    use std::{collections::HashMap, path::PathBuf};
    use super::{State, FileParsingResults};
    use crate::{create_selector};// operators_serv::OperatorRecord};

    create_selector!( CurDir,        cur_dir    , PathBuf       , clone = true );
    create_selector!( Flight,        flight     , u8   );
    create_selector!( IsAddFlight,   add_flight , bool );
    create_selector!( CurNick,       cur_nick   , Option<String>, clone = true );
    create_selector!( IsAddNick,     add_nick   , bool );
    create_selector!( IsAutoPlay,    auto_play  , bool );
    create_selector!( GroupsList,    groups_list, Vec<String>   , clone = true );
    create_selector!( OperatorsList  , operators_list   , HashMap<String, Vec<String>>, clone = true );
    create_selector!( ChosenFilesData, chosen_files_data, Option<FileParsingResults>  , clone = true );
}




pub fn on_new_drive_event(new_drive: &PathBuf, new_state: &mut State) {
    if let Ok(operator_id) = recognize_card(new_drive) {
        match find_operator_by_id_inhash(&new_state.operators_list, &operator_id) {
            Some(operator) => {
                dbg!("SD Card recognized!", &operator.0);
                new_state.cur_nick = Some(operator.0);
                new_state.add_nick = true;
            },
            None => {
                dbg!("SD Card NEW OPERATOR {}", &operator_id);
                new_state.cur_nick = None;
                new_state.add_nick = false;
            }
        }
    }
    println!("\nNEW DRIVE PLUGGED IN: {:?}", new_drive);
    let src_path = get_src_path_for_ext_drive(new_drive);
    crate::commands::unminimize_window();
    let rt = tokio::runtime::Runtime::new().unwrap();
    std::thread::spawn(move || {
        rt.block_on(on_choose_video_for_parsing(&src_path));
    });
}


fn reducer(state: State, action: Action) -> State {
    match action {
        Action::UpdState(payload) => payload,

        Action::UpdCurDir(payload)       => State{cur_dir   : payload, ..state},
        Action::ToggleAddFlight(payload) => State{add_flight: payload, ..state},
        Action::UpdFlight(payload)       => State{flight    : payload, add_flight: true, ..state},
        Action::ToggleAddNick(payload)   => State{add_nick  : payload, ..state},
        Action::ToggleAutoPlay(payload)  => State{auto_play : payload, ..state},

        Action::UpdCurNick(payload) => { match payload {
            Some(nick) => State{ cur_nick:Some(nick), add_nick:true , ..state },
            None       => State{ cur_nick:None      , add_nick:false, ..state },
        }},

        Action::DeleteCardIdFromList(payload) => {
            match delete_card_from_operators_file(&payload) {
                Ok(new_operators_list) => State{operators_list : new_operators_list, ..state},
                Err(_) => state
            }
        },

        Action::UpdOperatorsList(payload) => {
            match update_operators_file(&payload.nick, &payload.id_list[0]) {
                Ok(new_operators_list) => State{operators_list : new_operators_list, ..state},
                Err(_) => state
            }
        },

        Action::EventNewDrive(payload) => {
            let mut new_state = state.clone();
            on_new_drive_event(&payload, &mut new_state);
            new_state
        },

        Action::AddNewNick(payload) => {
            let normalized_name = normalize_name(&payload);
            if find_by_nick_inhash(&state.operators_list, &normalized_name).is_some() {
                return  state;
            }
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
                ..state
            }
        },

        Action::UpdChosenFilesData(payload) => {
            let width = if payload.is_none() {
                DEF_WINDOW_WIDTH                
            } else {
                LARGE_WINDOW_WIDTH
            };
            set_window_width(Some(width), None);
            State{chosen_files_data: payload, ..state}
        },
    }
}






pub fn init_store(static_store_cell: &std::sync::OnceLock<StoreType>) {
    init_operators_list_file();
    let initial_state = State::default();

    let store:StoreType = Store::new_with_state(reducer, initial_state);
    static_store_cell.set(store).unwrap_or_else(|_|panic!("Fail to init APP STORE"));
}

