use std::{
    collections::HashSet,
    fs::{ self, File },
    io::{ self, Read, Write },
    path::{ Path, PathBuf },
    time::SystemTime,
};

use toml::{
    Value,
    de::from_str,
    ser::to_string_pretty,
};


use rfd::FileDialog;

use tokio::time as tokio_time;



use crate::store_app::{Action, StoreType};



pub type MyResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;


const VERBATIM_PREFIX: &str = r"\\?\";




fn check_path<T: AsRef<Path>>(path: T) -> bool {
    let path_buf = PathBuf::from(path.as_ref());
    path_buf.exists()
}


pub fn extract_filename<T: AsRef<Path>>(path: T) -> String {
    let path_buf = PathBuf::from(path.as_ref());
    let filename = path_buf
        .file_name()
        .unwrap_or(std::ffi::OsStr::new("default"))
        .to_string_lossy();
    filename.into()
}

pub fn get_prefix_stripped_pathstr(path: &PathBuf) -> String {
    path.to_string_lossy().replace(VERBATIM_PREFIX, "")
}


fn convert_to_absolute_path_or_default<T: AsRef<Path>>(path: T) -> PathBuf {
    let def_path = PathBuf::from(".");
    let path     = PathBuf::from(path.as_ref());
    let canonical_path = fs::canonicalize(path).unwrap_or(
        fs::canonicalize(def_path).unwrap()
    );
    canonical_path
}


pub fn get_src_file_path(srs_dir_path: &PathBuf) -> Option<PathBuf> {
    let paths = fs::read_dir(srs_dir_path)
        .expect("Failed to read directory")
        .filter_map(Result::ok)
        .filter(|entry| {
            let path = entry.path();
            path.extension()
                .and_then(|ext| ext.to_str().map(|s| s.to_lowercase() == "mp4"))
                .unwrap_or(false)
        })
        .map(|entry| entry.path())
        .collect::<Vec<_>>();

    if !paths.is_empty() {
        Some(paths[0].to_owned())
    } else {
        None
    }
}


pub fn get_src_files_path_list<T: AsRef<Path>>(srs_dir_path: T) -> Option<Vec<PathBuf>> {
    let src_files_path_list = FileDialog::new()
        .add_filter("mp4_files", &["mp4", "MP4"])
        .set_directory(srs_dir_path)
        .set_can_create_directories(true)
        .pick_files();
    src_files_path_list
}


pub fn get_output_abs_dir(dest_dir_path: &PathBuf) -> PathBuf {
    convert_to_absolute_path_or_default(dest_dir_path)
}

pub fn get_output_file_path(
    src_file_path      : &PathBuf,
    dest_dir_path      : &PathBuf,
    output_file_postfix: &str,
    device_info        : &str,
    flight_info        : Option<u8>,
    operator_info      : Option<String>,
) -> PathBuf {
    let def_path = PathBuf::from(".");
    let dest_dir_path = get_output_abs_dir(dest_dir_path);
    let output_file_name = format!(
        "{} {} {} {}{}.mp4",
        operator_info.unwrap_or("".into()),
        match flight_info {
            Some(n) => format!("FLIGHT_{}", n),
            None    => "".into(),
        },
        device_info,
        src_file_path.file_stem().unwrap_or(&def_path.into_os_string()).to_str().unwrap(),
        output_file_postfix
    );

    let output_file_path = dest_dir_path.join(&output_file_name.trim());

    output_file_path
}



#[cfg(target_os = "windows")]
pub fn get_current_drives() -> HashSet<String> {
    let mut drives = HashSet::new();
    for letter in 'A'..='Z' {
        let drive_path = format!("{}:\\", letter);
        if Path::new(&drive_path).exists() {
            drives.insert(drive_path);
        }
    }
    drives
}

#[cfg(target_os = "linux")]
pub fn get_current_drives() -> HashSet<String> {
    let mut drives = HashSet::new();
    let mount_points = vec!["/mnt", "/media"];
    for mount_point in &mount_points {
        if fs::metadata(mount_point).is_ok() {
            if fs::read_dir(mount_point).unwrap().next().is_some() {
                drives.insert(mount_point.to_string());
            }
        }
    }
    drives
}


pub fn get_src_path_for_ext_drive(drivepath_str: &PathBuf) -> PathBuf {
    let dcim_path  = drivepath_str.join("DCIM");
    let gopro_path = dcim_path.join("100GOPRO");

    let res_path = if check_path(&gopro_path) {
        gopro_path
    } else if check_path(&dcim_path) {
        dcim_path
    } else {
        drivepath_str.clone()
    };
    res_path
}




pub fn copy_with_progress(
    src_file_path : &PathBuf,
    dest_file_path: &PathBuf,
) -> std::io::Result<()> {
    let mut src_file  = File::open(src_file_path)?;
    let mut dest_file = File::create(dest_file_path)?;

    let mut buffer = vec![0; 8_388_608];
    let total_bytes_to_copy = std::fs::metadata(src_file_path)?.len();
    let mut bytes_copied = 0;

    loop {
        let n = src_file.read(&mut buffer)?;
        if n == 0 {
            break;
        }
        bytes_copied += n;
        let progress = (bytes_copied as f64 / total_bytes_to_copy as f64) * 100.0;
        std::io::stdout().flush().unwrap();
        print!("Copying progress: {}%\r", progress.trunc());

        dest_file.write_all(&buffer[..n])?;
    }

    Ok(())
}



pub fn get_last_file(folder_path: &PathBuf) -> MyResult<fs::DirEntry> {
    let last_modified_file = fs::read_dir(folder_path)
       .expect("Couldn't access local directory")
       .filter_map(Result::ok)
       .filter(|entry| entry.path().is_file())
       .max_by_key(|entry| {
            match entry.metadata() {
                Ok(metadata) => metadata.modified().unwrap_or(SystemTime::UNIX_EPOCH),
                Err(_)       => SystemTime::UNIX_EPOCH,
            }
        });
        match last_modified_file {
            Some(dir_entry) => return Ok(dir_entry),
            None => return Err(Box::new(io::Error::new(
                io::ErrorKind::NotFound,
                "No  correct files found in the directory",
            ))),
        }

}

#[cfg(target_os = "windows")]
pub fn open_folder_last_file_selected(folder_path: &PathBuf) -> MyResult<fs::DirEntry> {
    let latest_file      = get_last_file(folder_path)?;
    let latest_file_name = get_prefix_stripped_pathstr(&latest_file.path());

    let _ = std::process::Command::new("explorer.exe")
        .args(&[
            "/select,",
            &latest_file_name.trim()
        ])
        .output()
        .expect("Failed to execute command");
    Ok(latest_file)
}
#[cfg(not(target_os = "windows"))]
pub fn open_folder_last_file_selected(folder_path: &PathBuf) -> MyResult<fs::DirEntry> {
    Err(Box::new(
        io::Error::new(io::ErrorKind::Other, "Not implemented yet")
    ))
}


pub fn open_output_folder_last_file_selected<T: AsRef<Path>>(
    config_dest_dir: T
) -> Result<fs::DirEntry, Box<dyn std::error::Error>>  {
    let path = PathBuf::from(config_dest_dir.as_ref());
    let output_dir_path = get_output_abs_dir(&path);
    open_folder_last_file_selected(&output_dir_path)
}



pub async fn watch_drives(store: &StoreType) {
    const FETCH_INTERVAL: u64 = 1000;

    let mut known_drives = get_current_drives();
    println!("\nInitial Drives: {:?}", known_drives);
    println!("WHATCHING FOR NEW DRIVE / CARD...");

    loop { //'drivers_loop:
        let current_drives = get_current_drives();

        for drive in &current_drives {
            if!known_drives.contains(drive) {
                println!("New drive detected: {}", drive);
                match fs::read_dir(drive) {
                    Ok(_entries) => {
                        let new_drive = get_src_path_for_ext_drive(&drive.as_str().into());
                        store.dispatch(Action::EventNewDrive(new_drive)).await;
                    },
                    Err(e) => {
                        println!("Error reading drive {}: {}", drive, e);
                    },
                }
            }
        }

        for drive in &known_drives {
            if!current_drives.contains(drive) {
                println!("Drive removed: {}", drive);
            }
        }

        known_drives = current_drives;

        tokio_time::sleep(tokio_time::Duration::from_millis(FETCH_INTERVAL)).await;
    }
}




pub fn init_file(file_path: &PathBuf) {
    if std::path::Path::new(file_path).exists() {
        println!("{:?} file found", file_path);
        return;
    }

    let default_config = "";
    fs::write(file_path, default_config).expect("Unable to write config file");
    println!("Created {:?} file", file_path);
}




pub fn update_toml_field<V: serde::Serialize>(
    file_path  : &PathBuf,
    field_name : &str,
    field_value: V,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = fs::File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;


    let new_value = Value::String(
        serde_json::to_string(&field_value).map_err(|e| e.to_string())?
    );

    let mut config: Value = from_str(&contents)?;

    if let Some(table) = config.as_table_mut() {
        if let Some(value) = table.get_mut(field_name) {
            *value = new_value;
        } else {
            table.insert(field_name.into(), new_value);
        }
    }

    let updated_contents = to_string_pretty(&config)?;

    file = fs::File::create(file_path)?;
    writeln!(file, "{}", updated_contents)?;

    Ok(())
}




