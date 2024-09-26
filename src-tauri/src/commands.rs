
use std::path::PathBuf;

use serde::{Serialize, Deserialize};

use tauri::{
    // api::dialog::MessageDialogBuilder,
    Manager
};


use crate::ffmpeg_serv::{ffmpeg_videofiles, run_ffmpeg};

use crate::file_sys_serv::{
    get_output_file_path,
    get_src_files_path_list, open_directory,
};

use crate::operators_serv::{
    find_operator_by_id_inhash,
    get_operator_id,
    OperatorRecord,
};

use crate::telemetry_analysis::{
    FileTelemetryResult,
    FileParsingErrData,
    FileParsingOkData,
    get_telemetry_for_files,
};

use crate::{
    store_app,
    store_config,
    STORE_APP_INSTANCE,
    STORE_CONFIG_INSTANCE,
};








crate::create_get_store_data_command!(get_app_store_data   , STORE_APP_INSTANCE   , store_app);
crate::create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);



pub fn emit_notification_event(title: &str, msg: &str) {
    unminimize_window();
    let _ = crate::APP_HANDLE_INSTANCE.get()
        .expect("app is not init yet")
        .emit_all("backend-notification", [title, msg]);
}

pub fn unminimize_window() {
    let _ = crate::APP_HANDLE_INSTANCE.get()
        .expect("app is not init yet")
        .get_window("MAIN")
        .expect("fail to get 'MAIN' window!")
        .unminimize();
}

pub fn set_window_width(w: Option<u32>, h: Option<u32>) {
    let window = crate::APP_HANDLE_INSTANCE.get().expect("app is not init yet")
    .get_window("MAIN").expect("fail to get 'MAIN' window!");
    
    let cur_size = window.outer_size().unwrap();
    let new_size = tauri::PhysicalSize::new(
        w.unwrap_or(cur_size.width),
        h.unwrap_or(cur_size.height)
    );
    let _ = window.set_size(new_size);
}



async fn on_ffmpeg_videofiles(
    parsing_results: &FileParsingOkData,
) {
    let store_app_instance    = STORE_APP_INSTANCE.get().expect("app_store instance n/a");
    let store_config_instance = STORE_CONFIG_INSTANCE.get().expect("config_store instance n/a");
    
    let config_values = store_config_instance.state_cloned().await;
    let app_values    = store_app_instance.state_cloned().await;

    let (ok_list, err_list) = ffmpeg_videofiles( parsing_results, &config_values, &app_values);
    let mut report = format!(
        "Успешно записано файлов: {}",
        ok_list.len()
    );
    let errors_cnt = err_list.len();
    if errors_cnt > 0 { report.push_str( &format!(
        "\nОшибки: {}\n{:?}\n{:?}",
        errors_cnt,
        &parsing_results,
        &err_list
    ))};

    if app_values.auto_play && ok_list.len() == 1 {
        match open::that(&ok_list[0]) {
            Ok(_)  => (),
            Err(e) => emit_notification_event(
                "Внимание!",
                &format!("Failed to auto play video\n{}", &e.to_string())
            ),
        }
    } else {
        emit_notification_event(
            "Parsing results:",
            &format!("{}", &report)
        )
    }
}



pub async fn on_choose_video_for_parsing(dir_path: &PathBuf) {
    let store_app_instance    = STORE_APP_INSTANCE.get().expect("app_store instance n/a");
    let store_config_instance = STORE_CONFIG_INSTANCE.get().expect("config_store instance n/a");
    
    let config_values = store_config_instance.state_cloned().await;
    // let app_values    = store_app_instance.state_cloned().await;


    match get_src_files_path_list(dir_path) {
        Some(path_list) => {
            let parsing_results = get_telemetry_for_files(&path_list, &config_values);
            store_app_instance.dispatch(store_app::Action::UpdChosenFilesData(Some(parsing_results.clone()))).await;
            set_window_width(Some(800), None);
        },
        None => {
            store_app_instance.dispatch(store_app::Action::UpdChosenFilesData(None)).await;
            set_window_width(Some(380), None);
        },
    };
    // on_parsing_result(&parsing_results, &config_values, &app_values);
}


// enum PathRecognitionResult {
//     VOID,
//     NEW(OperatorRecord),
//     UPD(String, OperatorRecord),
// }
// fn on_parsing_result(
//     parsing_results: &(FileParsingOkData, FileParsingErrData),
//     config_values  : &store_config::ConfigValues,
//     app_values     : &store_app::State,
// ) {
//     let (ok_data, err_data) = parsing_results;
//     if err_data.len() > 0 {
//         emit_notification_event("Parsing results:",
//             &format!("\nОшибки: {}\n{:?}\n", err_data.len(), err_data)
//         )
//     }
//     for (file_path, res_data) in ok_data {
//         let cur_camera_sn = &res_data.cam_info.serial;
//         dbg!(res_data);
//     }
// }







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
    let app_store_instance    = STORE_APP_INSTANCE.get().expect("app_store instance n/a");
    let config_store_instance = STORE_CONFIG_INSTANCE.get().expect("config_store instance n/a");

    let id: &str  = &input.id;
    let val: &str = &input.val;

    let mut resp = format!("ok {id} command, val {val}:");

    match id {
        "selectVideoFiles" => {
            let src_dir = if val.is_empty() {
                config_store_instance.select(store_config::SELECTORS::SrcDir).await
            } else {val.into()};
            on_choose_video_for_parsing(&src_dir).await;
        },
        "setFreefallTime" => {
            config_store_instance.dispatch(store_config::Action::UpdTimeFreefall(val.parse().unwrap())).await;
        },
        "setFlight" => {
            app_store_instance.dispatch(store_app::Action::UpdFlight(val.parse().unwrap())).await;
        },
        "toggleFlight" => {
            let new_is_flight = val.parse::<bool>().unwrap_or(
                !app_store_instance.select(store_app::SELECTORS::IsAddFlight).await
            );
            app_store_instance.dispatch(store_app::Action::ToggleAddFlight(new_is_flight)).await;
        },
        "setCurNick" => {
            let new_nick = if val.is_empty() { None } else { Some(val.into()) };
            app_store_instance.dispatch(store_app::Action::UpdCurNick(new_nick)).await;
        },
        "newNick" => {
            app_store_instance.dispatch(store_app::Action::AddNewNick(val.into())).await;
        },
        "toggleAutoPlay" => {
            let new_is_autoplay = val.parse::<bool>().unwrap_or(
                !app_store_instance.select(store_app::SELECTORS::IsAutoPlay).await
            );
            app_store_instance.dispatch(store_app::Action::ToggleAutoPlay(new_is_autoplay)).await;
        },
        "openParserFolder" => {
            let dest_dir = config_store_instance.select(store_config::SELECTORS::DestDir).await;
            let _ = open_directory(dest_dir);
        },

        _ => resp = format!("unknown command: {id} {val}"),
    };

    Ok(format!("API response: {resp}"))
}


