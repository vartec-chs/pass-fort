use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PasswordStorageCreateDto {
    pub path: String,
    pub name: String,
    pub description: Option<String>,
    pub master_password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PasswordStorageOpenDto {
    pub path: String,
    pub master_password: String,
}
