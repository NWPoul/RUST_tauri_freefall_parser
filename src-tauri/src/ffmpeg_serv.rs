
use std::{
    io::{
        Result    as IOResult,
        Error     as IOError,
        ErrorKind as IOErrorKind,
    },
    path::PathBuf,
    process::{
        Command,
        Stdio,
        // ChildStdout,
        // Output,
    }
};

use crate::{
    file_sys_serv::get_output_file_path,
    store_app,
    store_config,
    telemetry_analysis::FileParsingOkData,
    telemetry_parser_serv::CameraInfo,
};



pub const GLITCH_MARGIN: f64 = 2.0;


fn get_ffmpeg() -> IOResult<PathBuf> {
    let config_ffmpeg_path = store_config::FFMPEG_DIR_PATH.get().unwrap();
    check_get_ffmpeg(config_ffmpeg_path)
}
fn check_get_ffmpeg(ffmpeg_dir_path: &PathBuf) -> IOResult<PathBuf> {
    let ffmpeg_path = ffmpeg_dir_path.join("ffmpeg.exe");
    if ffmpeg_path.exists() {
        return Ok(ffmpeg_path);
    };

    eprintln!("\nffmpeg not found at {:?}... trying sys PATH", &ffmpeg_path);
    let output = Command::new("ffmpeg")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .output();

    match output {
        Ok(_) => {
            println!("OK ffmpeg is in the system PATH");
            Ok(PathBuf::from("ffmpeg"))
        },
        Err(_) => {
            println!("FAIL ffmpeg not in the system PATH");
            Err(IOError::new(IOErrorKind::NotFound, "ffmpeg not found!"))
        }
    }
}



pub fn run_ffmpeg(
   (src_file_path, dest_file_path): (&PathBuf, &PathBuf),
   (start_time, end_time)         : (f64, f64),
) -> Result<PathBuf, IOError> {
    let glitch_margin:f64 = if start_time >= GLITCH_MARGIN {
        GLITCH_MARGIN
    } else {
        start_time
    };

    let start_time = start_time - glitch_margin;

    let ffmpeg_path = get_ffmpeg()?
        .display().to_string();

    let mut ffmpeg_status = Command::new(&ffmpeg_path)
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .arg("-hide_banner")
        
        .arg("-ss").arg(start_time.to_string())
        .arg("-to").arg(end_time.to_string())
        .arg("-i" ).arg(src_file_path)
        .arg("-ss").arg(glitch_margin.to_string())
        .arg("-codec").arg("copy")
        .arg(dest_file_path)
        .arg("-n")
        .spawn()?;

    match ffmpeg_status.wait() {
        Ok(_)      => Ok(dest_file_path.clone()),
        Err(error) => Err(error)
    }
}


pub fn get_output_filepath(
    src_file_path : &PathBuf,
    cam_info      : &CameraInfo,
    config_values : &store_config::ConfigValues,
    app_values    : &store_app::State,
) -> PathBuf{
    let flight_info = match app_values.add_flight {
        true  => Some(app_values.flight),
        false => None,
    };

    let output_file_path = get_output_file_path(
        src_file_path,
        &(&config_values.dest_dir_path).into(),
        &config_values.output_file_postfix,
        &cam_info.model,
        flight_info,
        app_values.cur_nick.clone(),
    );
    output_file_path
}



pub fn ffmpeg_videofiles_backend(
    files_data   : &FileParsingOkData,
    config_values: &store_config::ConfigValues,
    app_values   : &store_app::State,
) -> (Vec<PathBuf>, Vec<String>) {

    let mut ok_list : Vec<PathBuf> = vec![];
    let mut err_list: Vec<String>  = vec![];

    for (file_src_path, file_res) in files_data {
        let output_file_path = get_output_filepath(
            file_src_path,
            &file_res.cam_info,
            config_values,
            app_values, 
        );

        match run_ffmpeg(
            (file_src_path, &output_file_path ),
            (file_res.start_time, file_res.end_time),
        ) {
            Ok(path) => ok_list.push(path),
            Err(err) => err_list.push(err.to_string()),
        };
    }

    (ok_list, err_list)
}

pub fn ffmpeg_videofiles_frontend(
    files_data   : &[(&PathBuf, &PathBuf, f64, f64)]
) -> (Vec<PathBuf>, Vec<String>) {

    let mut ok_list : Vec<PathBuf> = vec![];
    let mut err_list: Vec<String>  = vec![];

    for (src_path, output_path, start_time, end_time) in files_data {
        match run_ffmpeg(
            (src_path, output_path ),
            (*start_time, *end_time),
        ) {
            Ok(path) => ok_list.push(path),
            Err(err) => err_list.push(err.to_string()),
        };
    }

    (ok_list, err_list)
}