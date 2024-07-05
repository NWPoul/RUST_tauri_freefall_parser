use redux_rs::Store;


#[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
pub struct State {
    pub is_running: bool,
    pub remaining_time: u16,
    pub elapsed_time: u16,
    pub set_time: u16,
    pub cur_timeblock: u16,
    pub next_timeblock: u16,
    pub is_cycle: bool,
    pub msg: String,
    pub __reset_timer: bool,
}
impl Default for State { fn default() -> Self {
    State{
        is_running    : false,
        remaining_time: 150,
        elapsed_time  : 0,
        set_time      : 150,
        cur_timeblock : 150,
        next_timeblock: 0,
        is_cycle      : false,
        msg           : "".into(),
        __reset_timer : false,
    }
}}

#[derive(Debug)]
pub enum Action {
    Tick(i32),

    StartPause(String),
    Start(String),
    Stop(String),
    StartTimeblock(String),
    StartNextTimeblock(String),
    SetNextTimeblock(String),
    RestartTimeblock(String),
    Increment(String),
    ClearTimeblocks(String),
    ToggleCycle(String),
    UpdateMessage(String),

    __UpdResetTimerFlag(bool),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;

enum __TimeUpdMode {
    _REMAINING,
    _ELAPSED,
    BOTH,
}



pub const TICK_VAL: u16 = 1;



fn __positiv_mixsum(u_val: u16, i_val: i32) -> u16 {
    let res_i32: i32 = u_val as i32 + i_val;
    return if res_i32 > 0 { res_i32 as u16 } else { 0 };
}

fn __toggle_timer(state: State, is_running: bool) -> State {
    State{ is_running, ..state }
}

fn __upd_remaining_time(state: State, val: i32, re: __TimeUpdMode) -> State {
    match re {
        __TimeUpdMode::_REMAINING => State{
            remaining_time: __positiv_mixsum(state.remaining_time, val),
            ..state
        },
        __TimeUpdMode::_ELAPSED => State{
            elapsed_time: __positiv_mixsum(state.elapsed_time, val),
            ..state
        },
        __TimeUpdMode::BOTH => State{
            remaining_time: __positiv_mixsum(state.remaining_time, -val),
            elapsed_time: if !state.is_running {state.elapsed_time} else {
                __positiv_mixsum(state.elapsed_time, val)
            },
            ..state
        },
    }
}

fn __reset_timeblock(state: State) -> State {
    State{
        set_time      : state.cur_timeblock,
        remaining_time: state.cur_timeblock,
        elapsed_time  : 0,
        __reset_timer : true,
        ..state
    }
}

fn __start_timeblock(state: State, val: String) -> State {
    let val = val.parse().unwrap();
    dbg!(&val, &state);
    State{
        set_time      : val,
        remaining_time: val,
        cur_timeblock : val,
        elapsed_time  : 0,
        is_running    : true,
        __reset_timer : true,
        ..state
    }
}

fn __start_next_timeblock(state: State) -> State {
    let target_timeblock = if state.next_timeblock > 0 {state.next_timeblock} else {state.cur_timeblock};
    State{
        next_timeblock: if state.is_cycle {state.cur_timeblock} else {state.next_timeblock},
        ..__start_timeblock(state, target_timeblock.to_string())
    }

}

fn __set_next_timeblock(state: State, val: String) -> State {
    let mut next_timeblock: u16 = val.parse().unwrap();
    if next_timeblock == state.next_timeblock { next_timeblock = 0 }
    State{next_timeblock, ..state}
}

fn __control_increment(state: State, val: String) -> State {
    let val = val.parse().unwrap();
    State{
        remaining_time: __positiv_mixsum(state.remaining_time, val),
        set_time      : __positiv_mixsum(state.set_time, val),
        __reset_timer : true,
        ..state
    }
}




#[allow(non_snake_case)]
pub mod SELECTORS {
    use super::State;
    use crate::create_selector;

    create_selector!(); // ALLState
    create_selector!(IsRunning, is_running, bool);
    create_selector!(SetTime, set_time, u16);
    create_selector!(RemainingTime, remaining_time, u16);
    create_selector!(Msg, msg, String, clone = true);
    create_selector!(CurTimeblock, cur_timeblock, u16);
    create_selector!(__GetResetTimerFlag, __reset_timer, bool);
}


fn reducer(state: State, action: Action) -> State {
    match action {
        Action::StartPause(_) => State{
            is_running: !state.is_running,
            ..state
        },
        Action::Start(_) => __toggle_timer(state, true),
        Action::Stop(_) => __toggle_timer(state, false),

        Action::Tick(tick_val) => {
            let new_state = __upd_remaining_time(state, tick_val as i32, __TimeUpdMode::BOTH);
            new_state
        },

        Action::RestartTimeblock(_)   => __reset_timeblock(state),
        Action::StartNextTimeblock(_) => __start_next_timeblock(state),
        Action::SetNextTimeblock(val) => __set_next_timeblock(state, val),
        Action::StartTimeblock(val)   => __start_timeblock(state, val),
        Action::Increment(val)        => __control_increment(state, val),
        Action::ToggleCycle(_)        => State{is_cycle: !state.is_cycle, ..state},
        Action::ClearTimeblocks(_)    => State{is_cycle: false, next_timeblock: 0, ..state},
        Action::UpdateMessage(msg)    => State{msg: msg.into(), ..state},

        Action::__UpdResetTimerFlag(flag) => State{__reset_timer: flag, ..state},
        // _ => State {..state}
    }
}


pub fn get_store() -> Store<State, Action, fn(State, Action) -> State> {
    let initial_state = State::default();
    Store::new_with_state(reducer, initial_state)
}


