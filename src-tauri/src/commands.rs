

use serde::{Serialize, Deserialize};
// use tauri::{
//     AppHandle,
//     WindowBuilder,
//     WindowUrl,
// };



use crate::store_app;
use crate::store_config;

use crate::file_sys_serv::{
    watch_drives,
    get_src_files_path_list,
};

use crate::{
    STORE_APP_INSTANCE,
    STORE_CONFIG_INSTANCE,
    get_telemetry_for_files,
};



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
}


#[tauri::command]
pub async fn front_control_input(input: FrontInputEventStringPayload) -> Result<String, ()> {
    dbg!("FRONT: control_input: ", &input);
    // let store_instance = STORE_APP_INSTANCE.get()
    //     .expect("static store instance not init");

    let id: &str = &input.id;

    let resp = match id {
        "openFiles" => {
            on_open_files_for_parse().await;
            format!("ok {id} command:")
        },

        _ => format!("unknown command: {id}"),
    };

    dbg!(&resp);
    Ok(format!("API response: {resp}"))
}


