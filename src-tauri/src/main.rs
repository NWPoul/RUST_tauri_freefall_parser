// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::str::FromStr;

use tauri::{AppHandle, Manager, WindowBuilder, WindowUrl};
use serde::{Serialize, Deserialize};
use std::{sync::OnceLock, vec};


pub mod redux_serv;
pub mod store_app;
pub mod store_config;

mod core_timer;
use core_timer::run_timer;


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



create_store_subscriber!(timer_store_subscriber, "timer-state-update-event", &store_app::State);


fn app_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    //INIT APP_HANDLE GLOBAL INSTANCE
    APP_HANDLE_INSTANCE
        .set( app.app_handle().clone() )
        .expect("APP_HANDLE_INSTANCE initialisation error");

    tokio::spawn(async {
        let timer_store_instance = STORE_APP_INSTANCE.get()
            .expect("static timer store instance not init");
        timer_store_instance.subscribe(timer_store_subscriber).await;
        run_timer(timer_store_instance, store_app::TICK_VAL).await;
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


create_get_store_data_command!(get_timer_store_data , STORE_APP_INSTANCE   , store_app);
create_get_store_data_command!(get_config_store_data, STORE_CONFIG_INSTANCE, store_config);


#[tauri::command]
async fn front_control_input(input: FrontInputEventStringPayload) -> Result<String, ()> {
    dbg!("FRONT: control_input: ", &input);
    let store_instance = STORE_APP_INSTANCE.get()
        .expect("static store instance not init");

    let id: &str = &input.id;

    let resp = match id {
        "StartPause" => {
            store_instance.dispatch(store_app::Action::StartPause(input.val)).await;
            format!("ok {id} command:")
        },
        "Increment" => {
            store_instance.dispatch(store_app::Action::Increment(input.val)).await;
            format!("ok {id} command:")
        },
        "StartTimeblock" => {
            store_instance.dispatch(store_app::Action::StartTimeblock(input.val)).await;
            format!("ok {id} command:")
        },
        "StartNextTimeblock" => {
            store_instance.dispatch(store_app::Action::StartNextTimeblock(input.val)).await;
            format!("ok {id} command:")
        },
        "SetNextTimeblock" => {
            store_instance.dispatch(store_app::Action::SetNextTimeblock(input.val)).await;
            format!("ok {id} command:")
        },
        "RestartTimeblock" => {
            store_instance.dispatch(store_app::Action::RestartTimeblock(input.val)).await;
            format!("ok {id} command:")
        },
        "ClearTimeblocks" => {
            store_instance.dispatch(store_app::Action::ClearTimeblocks(input.val)).await;
            format!("ok {id} command:")
        },
        "ToggleCycle" => {
            store_instance.dispatch(store_app::Action::ToggleCycle(input.val)).await;
            format!("ok {id} command:")
        },
        "UpdateMessage" => {
            store_instance.dispatch(store_app::Action::UpdateMessage(input.val)).await;
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

            get_timer_store_data,
            get_config_store_data,
            front_control_input,
         ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

