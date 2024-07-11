use redux_rs::Store;
use std::path::PathBuf;


const DEF_DIR                : &str = ".";
const DEF_FILE_POSTFIX       : &str = "_FFCUT";
const DEF_DEP_TIME_CORRECTION:  f64 = 2.0;
const DEF_TIME_START_OFFSET  :  f64 = -60.0;
const DEF_TIME_END_OFFSET    :  f64 = 3.0;
const DEF_MIN_ACCEL_TRIGGER  :  f64 = 20.0;



#[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
pub struct State {
    pub srs_dir            : PathBuf,
    pub dest_dir           : PathBuf,
    pub ffmpeg_dir         : PathBuf,
    pub output_file_postfix: String,
    pub dep_time_correction: f64,
    pub time_start_offset  : f64,
    pub time_end_offset    : f64,
    pub min_accel_trigger  : f64,
    pub no_ffmpeg_process  : bool,
}

impl Default for State { fn default() -> Self {
    State{
        srs_dir            : DEF_DIR,
        dest_dir           : DEF_DIR,
        ffmpeg_dir         : DEF_DIR,
        output_file_postfix: DEF_FILE_POSTFIX.into(),
        dep_time_correction: DEF_DEP_TIME_CORRECTION,
        time_start_offset  : DEF_TIME_START_OFFSET,
        time_end_offset    : DEF_TIME_END_OFFSET,
        min_accel_trigger  : DEF_MIN_ACCEL_TRIGGER,
        no_ffmpeg_process  : false,
    }
}}


#[derive(Debug)]
pub enum Action {
    UpdSrsDir(PathBuf),            
    UpdDestDir(PathBuf),
    UpdFfmpegDir(PathBuf),
    UpdOutputFilePostfix(String),
    UpdDepTimeCorrection(f64),
    UpdTimeStartOffset(f64),
    UpdTimeEndOffset(f64),
    UpdMinAccelTrigger(f64),
    UpdNoFfmpegProcess(bool),
}

pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



#[allow(non_snake_case)]
pub mod SELECTORS {
    use super::State;
    use crate::create_selector;

    create_selector!(); // ALLState
    create_selector!(SrsDir,            srs_dir            , Path);
    create_selector!(DestDir,           dest_dir           , Path);
    create_selector!(FfmpegDir,         ffmpeg_dir         , Path);
    create_selector!(OutputFilePostfix, output_file_postfix, Stri);
    create_selector!(DepTimeCorrection, dep_time_correction, f64 );
    create_selector!(TimeStartOffset,   time_start_offset  , f64 );
    create_selector!(TimeEndOffset,     time_end_offset    , f64 );
    create_selector!(MinAccelTrigger,   min_accel_trigger  , f64 );
    create_selector!(NoFfmpegProcess,   no_ffmpeg_process  , bool);
}


fn reducer(state: State, action: Action) -> State {
    match action {
        Action::UpdSrsDir(payload)            => State{srs_dir             : payload, ..state},            
        Action::UpdDestDir(payload)           => State{dest_dir            : payload, ..state},
        Action::UpdFfmpegDir(payload)         => State{ffmpeg_dir          : payload, ..state},
        Action::UpdOutputFilePostfix(payload) => State{output_file_postfix : payload, ..state},
        Action::UpdDepTimeCorrection(payload) => State{dep_time_correction : payload, ..state},
        Action::UpdTimeStartOffset(payload)   => State{time_start_offset   : payload, ..state},
        Action::UpdTimeEndOffset(payload)     => State{time_end_offset     : payload, ..state},
        Action::UpdMinAccelTrigger(payload)   => State{min_accel_trigger   : payload, ..state},
        Action::UpdNoFfmpegProcess(payload)   => State{no_ffmpeg_process   : payload, ..state},
    }
}


pub fn get_store() -> Store<State, Action, fn(State, Action) -> State> {
    let initial_state = State::default();
    Store::new_with_state(reducer, initial_state)
}


