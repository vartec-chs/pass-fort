pub mod commands;
pub mod db;
pub mod dto;
pub mod state;
pub mod utils;

use std::sync::Arc;

use commands::*;
use tauri::{Builder, Manager, WindowEvent};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let app_state = state::AppState::init();

    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            password_storage::create_password_storage,
            password_storage::close_password_storage,
            password_storage::open_password_storage,
            password_generator::open_password_generator,
            password_generator::close_password_generator,
        ])
        .on_window_event(|window, event| {
            let app_handle = Arc::new(window.app_handle().clone()); // Arc для передачи в поток
            let app_handle_clone = Arc::clone(&app_handle);

            if let WindowEvent::CloseRequested { api, .. } = event {
                println!("Окно закрывается...");

                let window_label = window.label();

                if window_label == "main" {
                    tauri::async_runtime::spawn(async move {
                        let state = app_handle_clone.state::<state::AppState>();
                        match state.close_db(&app_handle_clone).await {
                            Ok(_) => {
                                println!("База данных успешно закрыта.");
                            }
                            Err(e) => {
                                app_handle_clone
                                    .dialog()
                                    .message(format!("Ошибка закрытия базы данных: {}", e))
                                    .kind(MessageDialogKind::Error)
                                    .title("Ошибка")
                                    .blocking_show();
                            }
                        }
                    });
                }

                // api.prevent_close(); // Оставьте, если хотите отменить закрытие
            }
        })
        .run(tauri::generate_context!())
        .expect("Ошибка запуска приложения");
}
