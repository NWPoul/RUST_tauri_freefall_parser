
// use tauri::{AppHandle, Manager, WindowBuilder, WindowUrl};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;


use crate::telemetry_analysis::{
    get_result_metadata_for_file,
    FileTelemetryResult,
};

use crate::file_sys_serv::{
    watch_drives,
    get_src_files_path_list,
};


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



create_get_store_data_command!(get_app_store_data , STORE_APP_INSTANCE   , store_app);
create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);



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

