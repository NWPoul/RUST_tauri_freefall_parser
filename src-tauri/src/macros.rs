
#[macro_export]
macro_rules! promptExit {
    ($msg: expr) => {
        crate::utils::u_serv::prompt_to_exit($msg);
        return;
    };
}

#[macro_export]
macro_rules! promptContinue {
    ($msg: expr) => {
        let confirm = crate::utils::u_serv::prompt_to_continue($msg);
        if confirm {continue} else {return};
    };
}
// macro_rules! promptExit_Ok {
//     ($msg: expr) => {
//         crate::utils::u_serv::prompt_to_exit($msg);
//         return Ok(());
//     };
// }


#[macro_export]
macro_rules! configValues {
    ($(($var:ident, $type:ty, $default:expr)),*) => {
        #[derive(Debug, Clone, PartialEq, PartialOrd, serde::Serialize)]
        pub struct ConfigValues {
            $(pub $var:$type),*
        }

        pub fn get_config_values() -> ConfigValues {
            let mut settings = Config::default();

            if let Err(e) = settings.merge(CfgFile::with_name("config.toml")) {
                println!("Failed to load configuration file: {}", e);
                println!("default configuration used");
            }
            println!("Config loaded from file");

            $(
                let $var = settings
                    .get::<$type>(stringify!($var))
                    .unwrap_or($default);
                println!(concat!(stringify!($var), ": {:?}"), $var);
            )*
            println!();

            ConfigValues {
                $($var),*
            }
        }
    };
}


#[macro_export]
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


#[macro_export]
macro_rules! create_get_store_data_command {
    ($name:ident, $store_instance:ident, $store_name:ident) => {
        #[tauri::command]
        pub async fn $name() -> Result<$store_name::State, ()> {
            let store_instance = $store_instance.get()
                .expect("static store instance not init");
            let store_data = store_instance.select($store_name::SELECTORS::AllState).await;
            Ok(store_data)
        }
    }
}