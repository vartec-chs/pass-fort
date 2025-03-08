use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
use std::path::PathBuf;
use tokio::task;

use tauri_plugin_store::StoreExt;
use serde_json::json;

use super::models::password_storage::PasswordStorageModel;

pub struct Database {
    connection: Option<Connection>,
    path: Option<PathBuf>,
}

impl Database {
    pub fn init() -> Self {
        Self {
            connection: None,
            path: None,
        }
    }

    pub async fn create(
        &mut self,
        path: PathBuf,
        data: PasswordStorageModel,
    ) -> rusqlite::Result<()> {
        let path_db = path.clone();
        let key = data.master_password.clone();

        let connection = task::spawn_blocking(move || -> Result<Connection, RusqliteError> {
            let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
            let conn = Connection::open_with_flags(path_db, flags).map_err(RusqliteError::from)?; // ✅ Преобразуем ошибку

            conn.execute_batch(&format!("PRAGMA key = '{}';", key))
                .map_err(RusqliteError::from)?; // ✅ Преобразуем ошибку

            Database::create_main_table(&conn, &data).map_err(RusqliteError::from)?;

            Ok(conn)
        })
        .await
        .map_err(|_| RusqliteError::ExecuteReturnedResults)??; // ✅ Обрабатываем `JoinError`

        self.connection = Some(connection);
        self.path = Some(path);

        Ok(())
    }

    pub async fn open(&mut self, path: PathBuf, key: String) -> rusqlite::Result<()> {
        let path_db = path.clone();
        let connection = task::spawn_blocking(move || -> Result<Connection, RusqliteError> {
            let flags = OpenFlags::SQLITE_OPEN_READ_WRITE;
            let conn = Connection::open_with_flags(path_db, flags).map_err(RusqliteError::from)?; // ✅ Преобразуем ошибку
            conn.execute_batch(&format!("PRAGMA key = '{}';", key))
                .map_err(RusqliteError::from)?; // ✅ Преобразуем ошибку

            conn.execute_batch("SELECT id FROM password_storage")
                .map_err(RusqliteError::from)?;

            Ok(conn)
        })
        .await
        .map_err(|_| RusqliteError::ExecuteReturnedResults)??; // ✅ Обрабатываем `JoinError`

        self.connection = Some(connection);
        self.path = Some(path);

        Ok(())
    }

    pub async fn close(&mut self, app_handle: &tauri::AppHandle) -> Result<String, RusqliteError> {
        if let Some(conn) = self.connection.take() {
            let result = task::spawn_blocking(move || conn.close())
                .await
                .map_err(|_| RusqliteError::ExecuteReturnedResults)?; // ✅ Обработка `JoinError`

            match result {
                Ok(_) => {
					match app_handle.store("settings.json") {
						Ok(settings) => {
							if let Some(path) = self.path.to_owned() {
								settings.set("db_path", path.to_str().unwrap());
								// settings.close_resource();
							}
						}
						Err(err) => println!("Ошибка при сохранении пути к базе данных: {}", err)
					}
					
                    println!("Соединение с базой данных успешно закрыто.");
                    Ok("Соединение с базой данных успешно закрыто.".to_string())
                }
                Err((conn, err)) => {
                    println!("Ошибка при закрытии соединения: {}", err);
                    self.connection = Some(conn); // 👈 Возвращаем соединение обратно, если ошибка
                    Err(err)
                }
            }
        } else {
            Ok("Соединение уже закрыто.".to_string())
        }
    }

    pub fn path(&self) -> Option<&PathBuf> {
        self.path.as_ref()
    }

    pub fn connection(&self) -> Option<&Connection> {
        self.connection.as_ref()
    }

    fn create_main_table(
        conn: &Connection,
        data: &PasswordStorageModel,
    ) -> Result<(), RusqliteError> {
        match conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS password_storage (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				description TEXT DEFAULT NULL,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			)",
        ) {
            Ok(_) => {
                match conn.execute(
                    "INSERT INTO password_storage (
						id, 
						name, 
						description, 
						created_at, 
						updated_at 
						)
						VALUES (?, ?, ?, ?, ?)",
                    params![
                        data.id,
                        data.name,
                        data.description,
                        data.created_at,
                        data.updated_at
                    ],
                ) {
                    Ok(_) => return Ok(()),
                    Err(err) => return Err(err),
                }
            }
            Err(err) => return Err(err),
        }
    }
}
