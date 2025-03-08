import { invokeCommands } from '@/configs/invoke-commands'
import { useInvoke } from '@/hooks/useInvoke'
import { useListen } from '@/hooks/useListen'

import { type FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { Logo } from '@components/shared/logo'

import { PATHS } from '@configs/paths'

const openNewWindow = () => {
	const newWindow = new WebviewWindow('password-generator', {
		url: `/${PATHS.PASSWORD_GENERATOR}`, // Маршрут в React Router
		title: 'Новое окно',
		decorations: false,
		width: 800,
		height: 600,
		resizable: false,
	})

	newWindow.once('tauri://created', () => {
		console.log('Окно создано')
	})

	newWindow.once('tauri://error', (e) => {
		console.error('Ошибка создания окна', e)
	})
}

export const HomeScreen: FC = () => {
	const navigate = useNavigate()

	const createStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.CREATE}`)

	const openStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.OPEN}`)

	const openPasswordGenerator = useInvoke<string>({
		command: invokeCommands.passwordGenerator.open,
		onError: (err) => toast.error(err.message),
	})

	useListen<string>('new_pass', (data) => {
		toast.success(data.payload)
	})

	return (
		<Box
			component='div'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
			}}
		>
			<Paper
				elevation={0}
				sx={{
					p: 2,
					borderRadius: 4,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					width: '400px',
				}}
			>
				<Stack
					component='div'
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Logo width={82} height={82} />
					<Typography fontWeight={600} color='textPrimary' variant='h4'>
						Pass Fort
					</Typography>
				</Stack>
				<Button onClick={openStorage} variant='contained' size='large'>
					Открыть хранилище
				</Button>

				<Button onClick={createStorage} variant='outlined' size='large'>
					Создать хранилище
				</Button>

				<Divider />
				<Button onClick={async () => await openPasswordGenerator.execute()} color='warning' variant='text' size='large'>
					Генератор паролей
				</Button>
			</Paper>
		</Box>
	)
}
