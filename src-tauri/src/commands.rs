
use std::path::PathBuf;

use serde::{Serialize, Deserialize};

use tauri::{
    // api::dialog::MessageDialogBuilder,
    Manager,
};


use crate::ffmpeg_serv::run_ffmpeg;

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




enum PathRecognitionResult {
    VOID,
    NEW(OperatorRecord),
    UPD(String, OperatorRecord),
}



crate::create_get_store_data_command!(get_app_store_data   , STORE_APP_INSTANCE   , store_app);
crate::create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);

fn get_app_and_config_store_instances() -> (&'static store_app::StoreType, &'static store_config::StoreType) {
    let store_app_instance    = STORE_APP_INSTANCE.get().expect("app+_tore instance n/a");
    let store_config_instance = STORE_CONFIG_INSTANCE.get().expect("config_store instance n/a");
    (store_app_instance, store_config_instance)
}



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



pub fn get_ffmpeg_status_for_file(
    src_file_path   : &PathBuf,
    file_result_data: &FileTelemetryResult,
    config_values   : &store_config::ConfigValues,
    app_values      : &store_app::State,
) -> Result<PathBuf, String> {
    let flight_info = match app_values.add_flight {
        true  => Some(app_values.flight),
        false => None,
    };

    let output_file_path = get_output_file_path(
        src_file_path,
        &(&config_values.dest_dir_path).into(),
        &config_values.output_file_postfix,
        &file_result_data.device_name,
        flight_info,
        app_values.cur_nick.clone(),
    );

    let ffmpeg_output = run_ffmpeg(
        (file_result_data.start_time, file_result_data.end_time),
        (&src_file_path, &output_file_path ),
        &config_values.ffmpeg_dir_path,
    );

    match ffmpeg_output {
        Ok(output_path) => Ok(output_path),
        Err(err)        => Err(err.to_string()),
    }
}


pub fn ffmpeg_ok_files(
    parsing_results: &(FileParsingOkData, FileParsingErrData),
    config_values  : &store_config::ConfigValues,
    app_values     : &store_app::State,
) -> (Vec<PathBuf>, Vec<String>) {

    let mut ok_list : Vec<PathBuf> = vec![];
    let mut err_list: Vec<String>  = vec![];

    for res in &parsing_results.0 {
        match get_ffmpeg_status_for_file(
            &res.0,
            &res.1,
            config_values,
            app_values,
        ) {
            Ok(dest_path) => ok_list.push(dest_path),
            Err(err_str)  => err_list.push(err_str),
        };
    }

    (ok_list, err_list)
}


fn recognize_src_path(app_values: &store_app::State, src_files_path_list: &Vec<PathBuf>) -> PathRecognitionResult {
    let test_path = src_files_path_list[0].clone();
    let cur_nick  = match &app_values.cur_nick {
        Some(v) => v,
        None    => return PathRecognitionResult::VOID,
    };

    let cur_card_id = match get_operator_id(&test_path) {
        Some(v) => v,
        None    => return PathRecognitionResult::VOID,
    };

    let cur_card_operator = find_operator_by_id_inhash(
        &app_values.operators_list,
        &cur_card_id
    );

    match cur_card_operator {
        Some(operator) if cur_nick == &operator.0 => PathRecognitionResult::VOID,
        Some(operator) => PathRecognitionResult::UPD(operator.0, OperatorRecord::new(cur_nick, &cur_card_id)),
        None => PathRecognitionResult::NEW(OperatorRecord::new(cur_nick, &cur_card_id)),
    }
}

async fn on_recognized_src_path_result(
    path_recognition_result: PathRecognitionResult,
    store_app_instance     : &store_app::StoreType,
) {
    match path_recognition_result {
        PathRecognitionResult::VOID => (),
        PathRecognitionResult::NEW(record) => {
            store_app_instance.dispatch(store_app::Action::UpdOperatorsList(record)).await
        },
        PathRecognitionResult::UPD(card_nick, record) => {
            emit_notification_event(
                "CARD ID SERV",
                &format!("СМЕНА ВЛАДЕЛЬЦА КАРТЫ!\nprev: {}\nnew: {}", &card_nick, &record.nick)
            );
            store_app_instance.dispatch(store_app::Action::DeleteCardIdFromList(record.id_list[0].clone())).await;
            store_app_instance.dispatch(store_app::Action::UpdOperatorsList(record)).await
        },
    };
}


pub async fn main_workflow_for_videofiles(dir_path: &PathBuf) {
    let src_files_path_list = match get_src_files_path_list(dir_path) {
        None            => return,
        Some(path_list) => path_list,
    };

    let (store_app_instance, store_config_instance) = get_app_and_config_store_instances();
    let config_values = store_config_instance.state_cloned().await;
    let app_values    = store_app_instance.state_cloned().await;

    let path_recognition_result = recognize_src_path(&app_values, &src_files_path_list);
    on_recognized_src_path_result(path_recognition_result, store_app_instance).await;

    let parsing_results = get_telemetry_for_files(&src_files_path_list, &config_values);

    if config_values.no_ffmpeg_processing {
        emit_notification_event(
            "Внимание!",
            &format!("FFmpeg откдючен в конфиге\nParsing results:\n{:?}", &parsing_results)
        );
        return
    }
    
    let ffmpeg_results = ffmpeg_ok_files(&parsing_results, &config_values, &app_values);

    let mut report = format!(
        "Успешно аписано файлов: {}",
        ffmpeg_results.0.len()
    );
    let errors_cnt = ffmpeg_results.1.len() + parsing_results.1.len();
    if errors_cnt > 0 { report.push_str( &format!(
        "\nОшибки: {}\n{:?}\n{:?}",
        errors_cnt,
        &parsing_results.1,
        &ffmpeg_results.1
    ))};

    if app_values.auto_play && ffmpeg_results.0.len() == 1 {
        match open::that(&ffmpeg_results.0[0]) {
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
    let (app_store_instance, config_store_instance) = get_app_and_config_store_instances();

    let id: &str  = &input.id;
    let val: &str = &input.val;

    let mut resp = format!("ok {id} command, val {val}:");

    match id {
        "selectVideoFiles" => {
            let src_dir = if val.is_empty() {
                config_store_instance.select(store_config::SELECTORS::SrcDir).await
            } else {val.into()};
            main_workflow_for_videofiles(&src_dir).await;
        },
        "setFreefallTime" => {
            config_store_instance
                .dispatch(store_config::Action::UpdTimeFreefall(val.parse::<f64>().unwrap()))
                .await;
        },
        "setFlight" => {
            app_store_instance
                .dispatch(store_app::Action::UpdFlight(val.parse::<u8>().unwrap()))
                .await;
        },
        "toggleFlight" => {
            let new_is_flight = val.parse::<bool>().unwrap_or(
                !app_store_instance.select(store_app::SELECTORS::IsAddFlight).await
            );
            app_store_instance
                .dispatch(store_app::Action::ToggleAddFlight(new_is_flight))
                .await;
        },
        "setCurNick" => {
            let new_nick = if val.is_empty() {
                None
            } else {
                Some(val.into())
            };
            app_store_instance
                .dispatch(store_app::Action::UpdCurNick(new_nick))
                .await;
        },
        "newNick" => {
            app_store_instance
                .dispatch(store_app::Action::AddNewNick(val.into()))
                .await;
        },
        "toggleAutoPlay" => {
            let new_is_autoplay = val.parse::<bool>().unwrap_or(
                !app_store_instance.select(store_app::SELECTORS::IsAutoPlay).await
            );
            // emit_notification_event("Тестовое","toggleAutoPlay");
            app_store_instance
                .dispatch(store_app::Action::ToggleAutoPlay(new_is_autoplay))
                .await;
        },
        "openParserFolder" => {
            let dest_dir = config_store_instance.select(store_config::SELECTORS::DestDir).await;
            let _ = open_directory(dest_dir);
        },

        _ => resp = format!("unknown command: {id} {val}"),
    };

    Ok(format!("API response: {resp}"))
}


