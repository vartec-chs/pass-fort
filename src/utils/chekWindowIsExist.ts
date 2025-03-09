import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow'
import * as logger from '@tauri-apps/plugin-log'

export const checkWindowIsExist = async (label: string): Promise<boolean> => {
	try {
		const result = await getAllWebviewWindows()
		return result.some((window) => window.label === label)
	} catch (err) {
		logger.error(err as string)
		return false
	}
}
