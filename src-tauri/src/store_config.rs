use redux_rs::Store;
use std::path::PathBuf;
use std::sync::OnceLock;


use config::{Config, File as CfgFile};

use crate::utils::error::MyResult;
use crate::file_sys_serv::{
    init_file,
    update_toml_field,
};





const CONFIG_FILE_NAME   : &str = "config.toml";

pub const DEF_DIR        : &str = ".";
const DEF_POSTFIX        : &str = "_FFCUT";
const DEP_TIME_CORRECTION:  f64 = 2.0;
const TIME_FREEFALL      :  f64 = 60.0;
const TIME_START_OFFSET  :  f64 = 0.0;
const TIME_END_OFFSET    :  f64 = 3.0;
const MIN_ACCEL_TRIGGER  :  f64 = 20.0;

pub static FFMPEG_DIR_PATH: OnceLock<PathBuf> = OnceLock::new();




pub type State = ConfigValues;
pub type StoreType = Store<State, Action, fn(State, Action) -> State>;



fn init_cfg_file() {
    let config_file_path: PathBuf = CONFIG_FILE_NAME.into();
    init_file(&config_file_path, "");
}

fn _update_config_field<V: serde::Serialize>(
    field_name: &str,
    field_value: V,
) -> MyResult<()> {
    let config_file_path: PathBuf = CONFIG_FILE_NAME.into();
    update_toml_field(
        &config_file_path,
        field_name,
        field_value,
    )
}





crate::BuildConfigValues!(
    ( srs_dir_path       , PathBuf, DEF_DIR.into() ),
    ( dest_dir_path      , PathBuf, DEF_DIR.into() ),
    ( ffmpeg_dir_path    , PathBuf, DEF_DIR.into() ),
    ( output_file_postfix, String , DEF_POSTFIX.to_string() ),
    ( dep_time_correction, f64    , DEP_TIME_CORRECTION ),
    ( time_freefall      , f64    , TIME_FREEFALL ),
    ( time_start_offset  , f64    , TIME_START_OFFSET ),
    ( time_end_offset    , f64    , TIME_END_OFFSET ),
    ( min_accel_trigger  , f64    , MIN_ACCEL_TRIGGER ),

    ( no_ffmpeg_processing, bool  , false )
);



#[derive(Debug)]
pub enum Action {
    UpdSrcDir(PathBuf),
    UpdDestDir(PathBuf),
    UpdOutputFilePostfix(String),
    UpdDepTimeCorrection(f64),
    UpdTimeFreefall(f64),
    UpdTimeStartOffset(f64),
    UpdTimeEndOffset(f64),
    UpdMinAccelTrigger(f64),
    UpdNoFfmpegProcess(bool),
}


#[allow(non_snake_case)]
pub mod SELECTORS {
    use std::path::PathBuf;
    use super::State;
    use crate::create_selector;

    create_selector!(SrcDir,            srs_dir_path        , PathBuf, clone = true);
    create_selector!(DestDir,           dest_dir_path       , PathBuf, clone = true);
    create_selector!(FfmpegDir,         ffmpeg_dir_path     , PathBuf, clone = true);
    create_selector!(OutputFilePostfix, output_file_postfix , String , clone = true);
    create_selector!(DepTimeCorrection, dep_time_correction , f64 );
    create_selector!(TimeFreefall,      time_freefall       , f64 );
    create_selector!(TimeStartOffset,   time_start_offset   , f64 );
    create_selector!(TimeEndOffset,     time_end_offset     , f64 );
    create_selector!(MinAccelTrigger,   min_accel_trigger   , f64 );
    create_selector!(NoFfmpegProcess,   no_ffmpeg_processing, bool);
}


fn reducer(state: State, action: Action) -> State {
    match action {
        Action::UpdSrcDir(payload)            => State{srs_dir_path        : payload, ..state},
        Action::UpdDestDir(payload)           => State{dest_dir_path       : payload, ..state},
        Action::UpdOutputFilePostfix(payload) => State{output_file_postfix : payload, ..state},
        Action::UpdDepTimeCorrection(payload) => State{dep_time_correction : payload, ..state},
        Action::UpdTimeFreefall(payload)      => State{time_freefall       : payload, ..state},
        Action::UpdTimeStartOffset(payload)   => State{time_start_offset   : payload, ..state},
        Action::UpdTimeEndOffset(payload)     => State{time_end_offset     : payload, ..state},
        Action::UpdMinAccelTrigger(payload)   => State{min_accel_trigger   : payload, ..state},
        Action::UpdNoFfmpegProcess(payload)   => State{no_ffmpeg_processing: payload, ..state},
    }
}



pub fn init_store(static_store_cell: &OnceLock<StoreType>) {
    init_cfg_file();
    let initial_state = ConfigValues::init();
    FFMPEG_DIR_PATH.set(initial_state.ffmpeg_dir_path.clone()).expect("Fail to init FFMPEG_DIR_PATH");
    let store:StoreType = Store::new_with_state(reducer, initial_state);
    static_store_cell.set(store).unwrap_or_else(|_|panic!("Fail to init CONFIG STORE"));
}