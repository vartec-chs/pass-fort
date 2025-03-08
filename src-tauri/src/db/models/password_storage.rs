use chrono::Utc;
use short_uuid::ShortUuid;

pub struct PasswordStorageModel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub master_password: String,
    pub created_at: String,
    pub updated_at: String,
}

impl PasswordStorageModel {
    pub fn new(name: String, description: Option<String>, master_password: String) -> Self {
        let created_at = Utc::now().format("%Y-%m-%d %H:%M:%S");
        let updated_at = Utc::now().format("%Y-%m-%d %H:%M:%S");

        Self {
            id: ShortUuid::generate().to_string(),
            name,
            description,
			master_password,
            created_at: created_at.to_string(),
            updated_at: updated_at.to_string(),
        }
    }

    pub fn init(
        id: String,
        name: String,
        description: Option<String>,
        master_password: String,
        created_at: String,
        updated_at: String,
    ) -> Self {
        Self {
            id,
            name,
            description,
            master_password,
            created_at,
            updated_at,
        }
    }
}
