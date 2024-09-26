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
pub mod operators_serv;
pub mod file_sys_serv;
pub mod telemetry_parser_serv;
pub mod telemetry_analysis;
pub mod ffmpeg_serv;
pub mod commands;


use utils::error::MyResult;


use file_sys_serv::{
    watch_drives,
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





fn init_app(app: &mut tauri::App) -> MyResult<()> {
    APP_HANDLE_INSTANCE
        .set( app.app_handle().clone() )
        .expect("APP_HANDLE_INSTANCE initialisation error");

    tokio::spawn(async {
        let store_app_instance    = STORE_APP_INSTANCE.get().expect("static app store instance not init");
        let store_config_instance = STORE_CONFIG_INSTANCE.get().expect("static config store instance not init");

        subscribe_apphandle_to_store!(store_app_instance, "app-state-update-event", &store_app::State).await;
        subscribe_apphandle_to_store!(store_config_instance, "config-state-update-event", &store_config::State).await;

        watch_drives(store_app_instance).await;
    });

    Ok(())
}



#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());


    store_config::init_store(&STORE_CONFIG_INSTANCE);
    store_app::init_store(&STORE_APP_INSTANCE);


    tauri::Builder::default()
        .setup(init_app)
        .invoke_handler(tauri::generate_handler![
            get_app_store_data,
            get_config_store_data,
            front_control_input,
         ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


