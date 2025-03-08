use std::path::PathBuf;

use crate::db::models::password_storage::PasswordStorageModel;
use crate::dto::password_storage::PasswordStorageOpenDto;
use crate::utils::api_result::ApiResult;
use crate::{dto::password_storage::PasswordStorageCreateDto, state::AppState};

use tauri::{LogicalSize, Manager, Size};

#[tauri::command]
pub async fn create_password_storage(
    state: tauri::State<'_, AppState>,
    handle: tauri::AppHandle,
    data: PasswordStorageCreateDto,
) -> Result<ApiResult<()>, ApiResult<()>> {
    let db = state.get_db();
    let mut db_lock = db.lock().await;

    let path_str = data.path.clone();
    let path = PathBuf::from(path_str);

    match !path.exists() {
        true => {
            let password_storage =
                PasswordStorageModel::new(data.name, data.description, data.master_password);

            match db_lock.create(path, password_storage).await {
                Ok(data) => {
                    set_size_dashboard(handle);
                    Ok(ApiResult::new(
                        true,
                        200,
                        "База данных создана.".to_string(),
                        data,
                    ))
                }
                Err(err) => Err(ApiResult::new(
                    false,
                    500,
                    format!("Ошибка при создании хранилища паролей: {}", err),
                    (),
                )),
            }
        }
        false => {
            return Err(ApiResult::new(
                false,
                400,
                "Путь уже существует.".to_string(),
                (),
            ))
        }
    }
}

#[tauri::command(rename_all = "snake_case")]
pub async fn open_password_storage(
    handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    data: PasswordStorageOpenDto,
) -> Result<ApiResult<()>, ApiResult<()>> {
    print!("Open password storage: {:?}", data);
    let db = state.get_db();
    let mut db_lock = db.lock().await;

    let path = PathBuf::from(data.path);
    let master_password = data.master_password;

    match path.exists() {
        true => match db_lock.open(path, master_password).await {
            Ok(data) => {
                set_size_dashboard(handle);
                Ok(ApiResult::new(
                    true,
                    200,
                    "База данных открыта.".to_string(),
                    data,
                ))
            }
            Err(err) => Err(ApiResult::new(
                false,
                500,
                format!("Ошибка при открытии хранилища паролей: {}", err),
                (),
            )),
        },
        false => {
            return Err(ApiResult::new(
                false,
                400,
                "Путь не существует.".to_string(),
                (),
            ))
        }
    }
}

#[tauri::command]
pub async fn close_password_storage(
    state: tauri::State<'_, AppState>,
    handle: tauri::AppHandle,
) -> Result<ApiResult<String>, ApiResult<()>> {
    let db = state.get_db();
    let mut db_lock = db.lock().await;

    match db_lock.close(&handle).await {
        Ok(data) => {
            set_default_size(handle);
            Ok(ApiResult::new(
                true,
                200,
                "База данных закрыта.".to_string(),
                data,
            ))
        }
        Err(err) => Err(ApiResult::new(
            false,
            500,
            format!("Ошибка при закрытии хранилища паролей: {}", err),
            (),
        )),
    }
}

fn set_size_dashboard(handle: tauri::AppHandle) {
    let window = handle.webview_windows();

    let main_window = window.get("main").unwrap();

    main_window.set_decorations(true).unwrap();

    match main_window.set_size(Size::Logical((1050.0, 575.0).into())) {
        Ok(_) => {
            println!("Size set successfully");
        }
        Err(err) => {
            println!("Failed to set size: {}", err);
        }
    }

    main_window.set_decorations(false).unwrap();

    main_window.center().unwrap();
}

fn set_default_size(handle: tauri::AppHandle) {
    let main_window = handle.get_webview_window("main").unwrap();

    main_window.set_decorations(true).unwrap();

    main_window
        .set_size(Size::Logical(LogicalSize {
            width: 760.0,
            height: 575.0,
        }))
        .unwrap();

    main_window.set_decorations(false).unwrap();
    main_window.center().unwrap();
}
