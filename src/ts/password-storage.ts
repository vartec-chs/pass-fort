export type PasswordStorageCreate = {
	name: string
	path: string
	description?: string
	master_password: string
}

export type PasswordStorageOpen = {
	path: string
	master_password: string
}
