// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{AppHandle, Manager};
use std::{sync::OnceLock, vec};
use std::path::PathBuf;
use config::{Config, File as CfgFile};


pub mod utils {
    pub mod error;
    pub mod u_serv;
}

pub mod macros;


pub mod redux_serv;
pub mod store_app;
pub mod store_config;
pub mod file_sys_serv;
pub mod telemetry_parser_serv;
pub mod telemetry_analysis;
pub mod commands;


use telemetry_analysis::{
    get_result_metadata_for_file,
    FileTelemetryResult,
};

use file_sys_serv::{
    watch_drives,
    // get_src_files_path_list,
};


use commands:: {
    front_control_input,
    get_app_store_data,
    get_config_store_data,
    StateUpdateEventPayload,
};


const DEF_DIR            : &str = ".";
const DEF_POSTFIX        : &str = "_FFCUT";
const DEP_TIME_CORRECTION:  f64 = 2.0;
const TIME_START_OFFSET  :  f64 = -60.0;
const TIME_END_OFFSET    :  f64 = 3.0;
const MIN_ACCEL_TRIGGER  :  f64 = 20.0;


type FileParsingOkData  = Vec<(PathBuf, FileTelemetryResult)>;
type FileParsingErrData = Vec<(PathBuf, String)>;


configValues!(
    ( srs_dir_path       , String , DEF_DIR.to_string() ),
    ( dest_dir_path      , String , DEF_DIR.to_string() ),
    ( ffmpeg_dir_path    , String , DEF_DIR.to_string() ),
    ( output_file_postfix, String , DEF_POSTFIX.to_string() ),
    ( dep_time_correction, f64    , DEP_TIME_CORRECTION ),
    ( time_start_offset  , f64    , TIME_START_OFFSET ),
    ( time_end_offset    , f64    , TIME_END_OFFSET ),
    ( min_accel_trigger  , f64    , MIN_ACCEL_TRIGGER ),

    ( no_ffmpeg_processing, bool  , false )
);



pub static APP_HANDLE_INSTANCE  : OnceLock< AppHandle > = OnceLock::new();
pub static STORE_APP_INSTANCE   : OnceLock< store_app::StoreType >    = OnceLock::new();
pub static STORE_CONFIG_INSTANCE: OnceLock< store_config::StoreType > = OnceLock::new();



create_store_subscriber! (
    store_app_subscriber,
    "app-state-update-event",
    &store_app::State
);
create_store_subscriber! (
    store_config_subscriber,
    "config-state-update-event",
    &store_config::State
);


fn app_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    APP_HANDLE_INSTANCE
        .set( app.app_handle().clone() )
        .expect("APP_HANDLE_INSTANCE initialisation error");
    Ok(())
}



pub fn get_telemetry_for_files(
    src_files_path_list: &[PathBuf],
    config_values      : &ConfigValues,
) -> (FileParsingOkData, FileParsingErrData) {
    let mut ok_list : FileParsingOkData  = vec![];
    let mut err_list: FileParsingErrData = vec![];

    for src_file_path in src_files_path_list {
        let input_file = src_file_path.to_string_lossy();

        match get_result_metadata_for_file(&input_file, &config_values) {
            Ok(data)     => ok_list.push((src_file_path.clone(), data)),
            Err(err_str) => err_list.push((src_file_path.clone(), err_str)),
        };
    };
    (ok_list, err_list)
}








#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    STORE_APP_INSTANCE.set(store_app::get_store()).unwrap_or(());
    STORE_CONFIG_INSTANCE.set(store_config::get_store()).unwrap_or(());


    tokio::spawn(async {
        let store_app_instance = STORE_APP_INSTANCE.get()
            .expect("static app store instance not init");
        store_app_instance.subscribe(store_app_subscriber).await;

        let store_config_instance = STORE_CONFIG_INSTANCE.get()
            .expect("static config store instance not init");
        store_config_instance.subscribe(store_config_subscriber).await;

        watch_drives(store_app_instance).await;
    });


    tauri::Builder::default()
        .setup(app_handler)
        .invoke_handler(tauri::generate_handler![
            get_app_store_data,
            get_config_store_data,
            front_control_input,
         ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

