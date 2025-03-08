import { FC } from 'react'

import { colors, useMediaQuery, useTheme } from '@mui/material'

import { Toaster } from 'react-hot-toast'

export const ToastsProvider: FC = () => {
	const isMobile = useMediaQuery('(max-width:600px)')
	const {
		palette: { mode },
		typography,
	} = useTheme()
	return (
		<Toaster
			position={isMobile ? 'top-center' : 'bottom-right'}
			gutter={8}
			containerStyle={{
				inset: 8,
			}}
			toastOptions={{
				duration: 5000,
				style: {
					
					maxWidth: 400,
					borderRadius: 8,
					width: isMobile ? '100%' : 'auto',
					backgroundColor: mode === 'light' ? colors.grey[100] : colors.grey[900],
					color: mode === 'light' ? '#333' : '#fff',
					fontFamily: typography.fontFamily,
				},
			}}
		/>
	)
}
