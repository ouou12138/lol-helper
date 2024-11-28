// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tokio_tungstenite::Connector::NativeTls;
use window_shadows::set_shadow;

// use window_vibrancy::apply_mica;

mod define;

mod http;
mod lcu_auth;
use http::{http_assets, http_request};
use lcu_auth::get_lcu_info;

fn main() {
    tauri::Builder::default()
        // 启用模糊及圆角
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            // #[cfg(target_os = "windows")]
            // apply_mica(&window, None)
            //     .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&window, true).unwrap();
            window.open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_lcu_info,
            http_request,
            http_assets
        ])
        .plugin({
            let tls_connector = native_tls::TlsConnector::builder()
                .danger_accept_invalid_certs(true)
                .danger_accept_invalid_hostnames(true)
                .build()
                .unwrap();
            tauri_plugin_websocket::Builder::default()
                .tls_connector(NativeTls(tls_connector))
                .build()
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
