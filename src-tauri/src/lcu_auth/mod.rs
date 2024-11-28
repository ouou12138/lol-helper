use crate::define::{HttpReqError, HttpReqErrorType};
use regex::Regex;
use std::process::Command;

#[tauri::command]
pub fn get_lcu_info() -> Result<LcuInfo, HttpReqError> {
    let output = Command::new("cmd")
        .arg("/C")
        .arg("chcp 65001 | wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline")
        .output()
        .expect("failed to execute process");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    if !stderr.is_empty() || stderr.contains("No Instance(s) Available.") {
        return Err(HttpReqError::new(
            Some(HttpReqErrorType::LcuUnConnect as u16),
            stderr.trim().to_string(),
        ));
    }

    Ok(create_lcu_info(stdout.to_string()))
}

#[derive(serde::Serialize)]
pub struct LcuInfo {
    port: u16,
    token: String,
}

fn create_lcu_info(info: String) -> LcuInfo {
    let port: u16 = get_info_data(&info, Regex::new(r"--app-port=([0-9]*)").unwrap())
        .parse()
        .unwrap();
    let token = get_info_data(
        &info,
        Regex::new(r"--remoting-auth-token=([\w-]*)").unwrap(),
    );

    LcuInfo {
        port,
        token: token.to_string(),
    }
}

fn get_info_data(datastr: &str, reg: Regex) -> &str {
    let caps = reg.captures(datastr).unwrap();
    caps.get(1).unwrap().as_str()
}
