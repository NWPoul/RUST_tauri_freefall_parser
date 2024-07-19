
use std::{
    io::{
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



pub const GLITCH_MARGIN: f64 = 3.0;



fn check_get_ffmpeg(ffmpeg_dir_path: &PathBuf) -> Result<PathBuf, IOError> {
    let ffmpeg_path = ffmpeg_dir_path.join("ffmpeg.exe");
    if ffmpeg_path.exists() {
        return Ok(ffmpeg_path);
    }

    eprintln!("\nffmpeg not found at {:?}... trying sys PATH", &ffmpeg_path);
    let output = Command::new("ffmpeg")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .output();

    match output {
        Ok(_) => {
            println!("OK ffmpeg is in the system PATH");
            return Ok(PathBuf::from("ffmpeg"));
        },
        Err(_) => {
            println!("FAIL ffmpeg not in the system PATH");
            let error = IOError::new(
                IOErrorKind::NotFound,
                "ffmpeg not found!"
            );
            return Err(error);
        }
    }
}



pub fn run_ffmpeg(
    target_start_end_time: (f64, f64),
    src_dest_files_path  : (&PathBuf, &PathBuf),
    ffmpeg_dir_path      : &PathBuf,
) -> Result<PathBuf, IOError> {
    let (mut start_time, end_time) = target_start_end_time;
    let (src_file_path, dest_file_path) = src_dest_files_path;


    let glitch_margin:f64 = if start_time >= GLITCH_MARGIN {
        GLITCH_MARGIN
    } else {
        start_time
    };

    start_time -= glitch_margin;

    let ffmpeg_path = check_get_ffmpeg(ffmpeg_dir_path)?
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
        .arg("-c")
        .arg("copy")
        .arg(dest_file_path)
        .arg("-n")
        .spawn()?;


    match ffmpeg_status.wait() {
        Ok(_)      => Ok(dest_file_path.clone()),
        Err(error) => Err(error)
    }
}