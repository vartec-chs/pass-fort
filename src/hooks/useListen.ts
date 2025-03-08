import { useEffect } from 'react'

import { type Event, listen } from '@tauri-apps/api/event'

export const useListen = <Return>(eventName: string, callback: (event: Event<Return>) => void) => {
	useEffect(() => {
		const eventHandler = listen<Return>(eventName, callback)

		return () => {
			eventHandler.then((unlisten) => unlisten())
		}
	}, [])
}
