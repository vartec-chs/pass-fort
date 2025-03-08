import { useEffect, useState } from 'react'

import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window'

// Тип для колбэка, который вызывается при изменении размера окна
type OnResizeCallback = (size: PhysicalSize) => void

// Тип для условия matches
type MatchesCondition = (size: { width: number; height: number }) => boolean

// Параметры хука
type UseWindowResizeOptions = {
	onResize?: OnResizeCallback
	matches?: MatchesCondition
}

export const useWindowResize = ({ onResize, matches }: UseWindowResizeOptions = {}) => {
	const [match, setMatch] = useState<boolean | null>(null)
	const [width, setWidth] = useState<number | null>(null)
	const [height, setHeight] = useState<number | null>(null)

	useEffect(() => {
		let unlisten: () => void

		const setupListener = async () => {
			// Подписываемся на событие изменения размера окна
			unlisten = await getCurrentWindow().onResized(({ payload: size }) => {
				const newM = !matches || matches({ width: size.width, height: size.height })
				setMatch(newM)
				const newWidth = size.width
				const newHeight = size.height
				setWidth(newWidth)
				setHeight(newHeight)
				// Проверяем условие matches, если оно передано
				if (newM) {
					if (onResize) {
						onResize(size) // Вызываем колбэк, если условие выполнено
					}
				}
			})
		}

		setupListener()

		return () => {
			if (unlisten) {
				unlisten()
			}
		}
	}, [onResize])

	return { width, height, match }
}
