// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::str::FromStr;

use tauri::{AppHandle, Manager, WindowBuilder, WindowUrl};
use serde::{Serialize, Deserialize};
use std::{sync::OnceLock, vec};
use std::path::PathBuf;
use config::{Config, File as CfgFile};


pub mod utils {
    pub mod error;
    pub mod u_serv;
}


pub mod redux_serv;
pub mod store_app;
pub mod store_config;
pub mod file_sys_serv;
pub mod telemetry_parser_serv;
pub mod telemetry_analysis;
pub mod commands;

pub mod macros;

use telemetry_analysis::{
    get_result_metadata_for_file,
    FileTelemetryResult,
};

use file_sys_serv::{
    watch_drives,
    get_src_files_path_list,
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




static APP_HANDLE_INSTANCE: OnceLock< AppHandle > = OnceLock::new();

static STORE_APP_INSTANCE   : OnceLock< store_app::StoreType >    = OnceLock::new();
static STORE_CONFIG_INSTANCE: OnceLock< store_config::StoreType > = OnceLock::new();



#[derive(Clone, Serialize)]
struct StateUpdateEventPayload<P: Serialize>(P);


#[derive(Debug, Clone, Deserialize)]
struct FrontInputEventStringPayload {
    id : String,
    val: String,
}
#[derive(Debug, Clone, Deserialize)]
enum FrontInputMixVal {
    Text(String),
    Bool(bool),
    Array16(Vec<i16>),
}
#[derive(Debug, Clone, Deserialize)]
struct FrontInputEventMixPayload {
    id : String,
    val: FrontInputMixVal,
}


macro_rules! create_store_subscriber {
    ($name:ident, $event:expr, $state_type:ty) => {
        fn $name(state: $state_type) {
            APP_HANDLE_INSTANCE.get()
                .expect("app is not init yet")
                .emit_all($event, StateUpdateEventPayload(state))
                .unwrap();
            println!("New state: {:?}", state);
        }
    }
}

macro_rules! create_get_store_data_command {
    ($name:ident, $store_instance:ident, $store_name:ident) => {
        #[tauri::command]
        async fn $name() -> Result<$store_name::State, ()> {
            let store_instance = $store_instance.get()
                .expect("static store instance not init");
            let store_data = store_instance.select($store_name::SELECTORS::AllState).await;
            Ok(store_data)
        }
    }
}



create_store_subscriber!(store_app_subscriber, "app-state-update-event", &store_app::State);


fn app_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    //INIT APP_HANDLE GLOBAL INSTANCE
    APP_HANDLE_INSTANCE
        .set( app.app_handle().clone() )
        .expect("APP_HANDLE_INSTANCE initialisation error");

    tokio::spawn(async {
        let store_app_instance = STORE_APP_INSTANCE.get()
            .expect("static app store instance not init");
        store_app_instance.subscribe(store_app_subscriber).await;
        watch_drives(store_app_instance).await;
    });

    Ok(())
}



#[tauri::command]
fn open_control_window(app: AppHandle) {
    WindowBuilder::new(&app, "CONTROL", WindowUrl::App("index.html".into()))
        .title("control panel")
        .fullscreen(false)
        .resizable(false)
        .inner_size(1280.0, 1024.0)
        .center()
        .build()
        .expect("Error creating control panel window");
}


create_get_store_data_command!(get_app_store_data , STORE_APP_INSTANCE   , store_app);
create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);







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


fn on_open_files() {
    let config_values = get_config_values();
    let src_files_path_list = match get_src_files_path_list(".") {
        None => {
            println!("NO MP4 FILES CHOSEN!");
            return;// Ok(format!("NO MP4 FILES CHOSEN!"))
        }
        Some(path_list) => path_list,
    };
    let parsing_results = get_telemetry_for_files(&src_files_path_list, &config_values);
}


#[tauri::command]
async fn front_control_input(input: FrontInputEventStringPayload) -> Result<String, ()> {
    dbg!("FRONT: control_input: ", &input);
    // let store_instance = STORE_APP_INSTANCE.get()
    //     .expect("static store instance not init");

    let id: &str = &input.id;

    let resp = match id {
        "openFiles" => {
            on_open_files();
            format!("ok {id} command:")
        },

        _ => format!("unknown command: {id}"),
    };

    dbg!(&resp);
    Ok(format!("API response: {resp}"))
}






#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    // INIT APP_STORE & CONFIG GLOBAL INSTANCE
    STORE_APP_INSTANCE.set(store_app::get_store()).unwrap_or(());
    STORE_CONFIG_INSTANCE.set(store_config::get_store()).unwrap_or(());


    tauri::Builder::default()
        .setup(app_handler)
        .invoke_handler(tauri::generate_handler![
            open_control_window,

            get_app_store_data,
            get_config_store_data,
            front_control_input,
         ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

