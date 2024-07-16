#![allow(unused_braces)]

use std::path::PathBuf;

// use redux_rs::StoreApi;
use serde::{Serialize, Deserialize};
// use tauri::{
//     AppHandle,
//     WindowBuilder,
//     WindowUrl,
// };



use crate::ffmpeg_serv::run_ffmpeg;
use crate::file_sys_serv::get_output_file_path;
use crate::store_app;
use crate::store_config;

use crate::file_sys_serv::{
    get_src_files_path_list,
};

use crate::telemetry_analysis::{
    FileTelemetryResult,
    FileParsingErrData,
    FileParsingOkData,
};
use crate::{
    STORE_APP_INSTANCE,
    STORE_CONFIG_INSTANCE,
    get_telemetry_for_files,
};



crate::create_get_store_data_command!(get_app_store_data   , STORE_APP_INSTANCE   , store_app);
crate::create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);



async fn on_open_files_for_parse() {
    let store_config_instance = STORE_CONFIG_INSTANCE.get()
        .expect("static config store instance not init");
    let config_values = store_config_instance.select(store_config::SELECTORS::AllState).await;

    let src_files_path_list = match get_src_files_path_list(".") {
        None => {
            println!("NO MP4 FILES CHOSEN!");
            return;// Ok(format!("NO MP4 FILES CHOSEN!"))
        }
        Some(path_list) => path_list,
    };
    let parsing_results = get_telemetry_for_files(&src_files_path_list, &config_values);

    ffmpeg_ok_files(&parsing_results, &config_values);
}


pub fn get_ffmpeg_status_for_file(
    src_file_path   : &PathBuf,
    file_result_data: &FileTelemetryResult,
    config_values   : &store_config::ConfigValues,
) -> Result<String, String> {
    let output_file_path = get_output_file_path(
        src_file_path,
        &(&config_values.dest_dir_path).into(),
        &config_values.output_file_postfix,
        &file_result_data.device_name,
    );


    let ffmpeg_output = run_ffmpeg(
        (file_result_data.start_time, file_result_data.end_time),
        (&src_file_path, &output_file_path ),
        &config_values.ffmpeg_dir_path,
    );


    match ffmpeg_output {
        Ok(_output) => {
            println!("\nFFMPEG OK:");// {:?}", _output.stderr);
            Ok("FFMPEG STATUS - OK".into())
        },
        Err(err)  => {
            println!("\nFFMPEG ERR: {:?}", err.to_string());
            Err(err.to_string())
        }
    }
}

pub fn ffmpeg_ok_files(
    parsing_results: &(FileParsingOkData, FileParsingErrData),
    config_values  : &store_config::ConfigValues,
) {
    for res in &parsing_results.0 {
        _ = get_ffmpeg_status_for_file(
            &res.0,
            &res.1,
            config_values,
        );
    }
}





#[derive(Clone, Serialize)]
pub struct StateUpdateEventPayload<P: Serialize>(pub P);

#[derive(Debug, Clone, Deserialize)]
pub struct FrontInputEventStringPayload {
    pub id : String,
    pub val: String,
}
#[derive(Debug, Clone, Deserialize)]
pub enum FrontInputMixVal {
    Text(String),
    Bool(bool),
    Array16(Vec<i16>),
}
#[derive(Debug, Clone, Deserialize)]
pub struct FrontInputEventMixPayload {
    pub id : String,
    pub val: FrontInputMixVal,
}



#[tauri::command]
pub async fn front_control_input(input: FrontInputEventStringPayload) -> Result<String, ()> {
    dbg!("FRONT: control_input: ", &input);
    let app_store_instance = STORE_APP_INSTANCE.get()
        .expect("static app store instance not init");
    let config_store_instance = STORE_CONFIG_INSTANCE.get()
        .expect("static config store instance not init");

    let id: &str  = &input.id;
    let val: &str = &input.val;

    let mut resp = format!("ok {id} command, val {val}:");

    match id {
        "openFiles" => {
            on_open_files_for_parse().await;
        },
        "setFreefallTime" => {
            config_store_instance
                .dispatch(store_config::Action::UpdTimeStartOffset(val.parse::<f64>().unwrap()))
                .await;
        },
        "setFlight" => {
            app_store_instance
                .dispatch(store_app::Action::UpdFlight(val.parse::<u8>().unwrap()))
                .await;
        },
        "setName" => {
            app_store_instance
                .dispatch(store_app::Action::UpdName(val.into()))
                .await;
        },

        _ => resp = format!("unknown command: {id} {val}"),
    };

    dbg!(&resp);
    Ok(format!("API response: {resp}"))
}


