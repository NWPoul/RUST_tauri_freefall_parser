
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
        #[derive(Debug, Clone)]
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
                println!(concat!(stringify!($var), ": {}"), $var);
            )*
            println!();

            ConfigValues {
                $($var),*
            }
        }
    };
}
