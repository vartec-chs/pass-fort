use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResult<T> {
    pub is_success: bool,
    pub status_code: u16,
    pub message: String,
    pub data: T,
}

impl<T> ApiResult<T> {
    pub fn new(is_success: bool, status_code: u16, message: String, data: T) -> Self {
        Self {
            is_success,
            status_code,
            message,
            data,
        }
    }
}
