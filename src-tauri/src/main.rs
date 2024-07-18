// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![allow(unused_braces)]


use tauri::{AppHandle, Manager};
use std::{sync::OnceLock, vec};
// use std::path::PathBuf;


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
pub mod ffmpeg_serv;
pub mod commands;


use telemetry_analysis::{
    // get_result_metadata_for_file,
    get_telemetry_for_files,
    // FileTelemetryResult,
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



pub static APP_HANDLE_INSTANCE  : OnceLock<AppHandle>               = OnceLock::new();
pub static STORE_APP_INSTANCE   : OnceLock<store_app::StoreType>    = OnceLock::new();
pub static STORE_CONFIG_INSTANCE: OnceLock<store_config::StoreType> = OnceLock::new();



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

    tokio::spawn(async {
        let store_app_instance = STORE_APP_INSTANCE.get()
            .expect("static app store instance not init");
        store_app_instance.subscribe(store_app_subscriber).await;

        let store_config_instance = STORE_CONFIG_INSTANCE.get()
            .expect("static config store instance not init");
        store_config_instance.subscribe(store_config_subscriber).await;

        watch_drives(store_app_instance).await;
    });

    Ok(())
}





#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    store_config::init_cfg_file();
    store_app::init_operators_list_file();

    STORE_APP_INSTANCE.set(store_app::get_store()).unwrap_or(());
    STORE_CONFIG_INSTANCE.set(store_config::get_store()).unwrap_or(());

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

