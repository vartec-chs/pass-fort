use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

use crate::utils::api_result::ApiResult;

#[tauri::command]
pub async fn open_password_generator(
    app: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<String>> {
    if app.get_webview_window("password-generator").is_some() {
        return Ok(ApiResult::new(
            true,
            4000,
            "Окно генератора паролей уже открыто".to_string(),
            (),
        ));
    }

    let webview_url = WebviewUrl::App("/password-generator".into());
    let result = WebviewWindowBuilder::new(&app, "password-generator", webview_url)
        .title("Генератор паролей")
        .inner_size(400.0, 500.0)
        .decorations(false)
        .transparent(true)
        .resizable(false)
        .devtools(true) // Включаем DevTools
        .center()
        .always_on_top(false)
        .closable(true)
        .build();

    match result {
        Ok(_) => Ok(ApiResult::new(
            true,
            200,
            "Окно генератора паролей открыто".to_string(),
            (),
        )),
        Err(err) => Err(ApiResult::new(
            false,
            500,
            format!("Ошибка при открытии окна генератора паролей: {}", err),
            "Ошибка при открытии окна генератора паролей".to_string(),
        )),
    }
}

#[tauri::command]
pub fn close_password_generator(app: tauri::AppHandle) -> Result<ApiResult<()>, ApiResult<()>> {
    let window = app.get_webview_window("password_generator").unwrap();
    match window.set_visible_on_all_workspaces(false) {
        Ok(_) => Ok(ApiResult::new(
            true,
            200,
            "Password generator window closed successfully.".to_string(),
            (),
        )),
        Err(err) => Err(ApiResult::new(
            false,
            500,
            format!("Failed to close password generator window: {}", err),
            (),
        )),
    }
}
