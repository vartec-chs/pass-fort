import { load } from '@tauri-apps/plugin-store'

export const APP_NAME = 'Pass Fort'
export const EXTENSION_NAME = 'Pass Fort'
export const EXTENSION_FILE = 'ps.db'

export const settings = await load('settings.json', { autoSave: true })
