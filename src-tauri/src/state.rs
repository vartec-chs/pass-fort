use crate::db::core::Database;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct AppState {
    db: Arc<Mutex<Database>>,
}

impl AppState {
    // Создает новый экземпляр состояния с инициализацией базы данных
    pub fn init() -> Self {
        Self {
            db: Arc::new(Mutex::new(Database::init())),
        }
    }

    // Возвращает ссылку на `Mutex<Database>`, чтобы управлять базой данных
    pub fn get_db(&self) -> Arc<Mutex<Database>> {
        Arc::clone(&self.db)
    }

    // Закрывает базу данных при завершении работы приложения
    pub async fn close_db(&self, app_handle: &tauri::AppHandle) -> rusqlite::Result<String, rusqlite::Error> {
        let mut db = self.db.lock().await;
        db.close(app_handle).await
    }
}
