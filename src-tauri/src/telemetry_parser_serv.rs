

use std::sync::{ Arc, atomic::AtomicBool };

use telemetry_parser::Input as TpInput;
use telemetry_parser::util as tp_util;

use crate::telemetry_analysis::format_camera_name;



#[derive(Debug, Clone, PartialEq, serde::Serialize)]
pub struct CameraInfo {
    pub model : String,
    pub serial: Option<String>,
}


pub struct TelemetryData {
    pub file_name : String,
    pub cam_info  : CameraInfo,
    pub acc_data  : Vec<(f64, f64, f64)>,
}



fn get_cam_serial(sample_0: &tp_util::SampleInfo) -> Option<String> {
    if let Some(grouped_tag_map) = sample_0.tag_map.as_ref() {
        for map in grouped_tag_map.values() {
            if let Some(taginfo) = map.values().find(|taginfo| taginfo.description == "CASN") {
                return Some(taginfo.value.to_string());
            }
        }
    }
    println!("NO CASN");
    return None
}
fn get_cam_info(input: &TpInput) -> CameraInfo {
    let mut cam_model  = "".to_string();
    let mut cam_serial = None;

    if let Some(model) = input.camera_model() {
        cam_model = format_camera_name(model);
    };
    if let Some(samples) = &input.samples {
        cam_serial = get_cam_serial(&samples[0]);
    };

    println!("Detected camera: {cam_model} {:?}", &cam_serial);

    CameraInfo{
        model : cam_model.into(),
        serial: cam_serial,
    }
}



pub fn parse_telemetry_from_file(input_file: &str) -> Result<TelemetryData, String> {
    let mut stream = match std::fs::File::open(input_file) {
        Ok(stream) => stream,
        Err(e) => {return Err(e.to_string());},
    };

    let filesize = match stream.metadata() {
        Ok(metadata) => metadata.len() as usize,
        Err(e) => {return Err(e.to_string());},
    };


    let input = match TpInput::from_stream(&mut stream, filesize,input_file, |_|(), Arc::new(AtomicBool::new(false))) {
        Ok(input) => input,
        Err(e) => {return Err(format!("FAIL TO PARSE TELEMETRY! {}", e.to_string()));},
    };

    let cam_info = get_cam_info(&input);

    let imu_data = match tp_util::normalized_imu(&input, None) {
        Ok(data) => data,
        Err(e) => {return Err(format!("FAIL TO GET IMUDATA! {}", e.to_string()));},
    };

    let mut telemetry_xyz_acc_data: Vec<(f64, f64, f64)> = Vec::new();

    for v in imu_data {
        if v.accl.is_some() {
            let accl = v.accl.unwrap_or_default();
            telemetry_xyz_acc_data.push((accl[0], accl[1],accl[2]));
        }
    }

    Ok(TelemetryData {
        cam_info,
        file_name: input_file.to_string(),
        acc_data : telemetry_xyz_acc_data,
    })
}
