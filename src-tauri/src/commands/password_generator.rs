use tauri::{Manager, Url, WebviewUrl, WebviewWindowBuilder};

use crate::utils::api_result::ApiResult;

#[tauri::command]
pub async fn open_password_generator(
    app: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<String>> {
    let webview_url = WebviewUrl::App("/password-generator".into());

    // let webview_url = WebviewUrl::External(Url::parse("https://yandex.ru").unwrap());

    let result = WebviewWindowBuilder::new(&app, "password-generator", webview_url)
        .title("Генератор паролей")
        .inner_size(400.0, 500.0)
        .decorations(false)
        .transparent(true)
        .resizable(false)
        .devtools(true) // Включаем DevTools
        .center()
        .always_on_top(true)
        .closable(true)
        .build();

    match result {
        Ok(res) => Ok(ApiResult::new(
            true,
            200,
            "Password generator window opened successfully.".to_string(),
            (),
        )),
        Err(err) => Err(ApiResult::new(
            false,
            500,
            format!("Failed to open password generator window: {}", err),
            "Failed to open password generator window".to_string(),
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
