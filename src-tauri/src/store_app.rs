use redux_rs::Store;
use std::path::PathBuf;



#[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
pub struct State {
    pub cur_dir   : PathBuf,
    pub add_flight: bool,
    pub add_name  : bool,
    // pub cur_date  : String,
}

impl Default for State { fn default() -> Self {
    State{
        cur_dir    : ".".into(),
        add_flight : false,
        add_name   : false,
        // cur_date   : "".into(),
    }
}}


#[derive(Debug)]
pub enum Action {
    EventNewDrive(PathBuf),
    UpdCurDir(PathBuf),
    ToggleAddFlight(bool),
    ToggleAddName(bool),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



#[allow(non_snake_case)]
pub mod SELECTORS {
    use std::path::PathBuf;
    use super::State;
    use crate::create_selector;

    create_selector!(); // ALLState
    create_selector!( UpdCurDir,       cur_dir   , PathBuf, clone = true );
    create_selector!( ToggleAddFlight, add_flight, bool );
    create_selector!( ToggleAddName,   add_name  , bool );
}



pub fn on_new_drive_event(new_drive: &PathBuf) {
    println!("\nNEW DRIVE PLUGGED IN: {:?}", new_drive);
}



fn reducer(state: State, action: Action) -> State {
    match action {
        Action::EventNewDrive(payload)   => {
            on_new_drive_event(&payload);
            state
        },
        Action::UpdCurDir(payload)       => State{cur_dir   : payload, ..state},
        Action::ToggleAddFlight(payload) => State{add_flight: payload, ..state},
        Action::ToggleAddName(payload)   => State{add_name  : payload, ..state},
    }
}


pub fn get_store() -> Store<State, Action, fn(State, Action) -> State> {
    let initial_state = State::default();
    Store::new_with_state(reducer, initial_state)
}