import { checkWindowIsExist } from '@/utils/chekWindowIsExist'

import { type FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow'
import * as logger from '@tauri-apps/plugin-log'

import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { LockKeyhole } from 'lucide-react'

import { Logo } from '@components/shared/logo'

import { useInvoke } from '@hooks/useInvoke'
import { useListen } from '@hooks/useListen'

import { useInterval } from '@hooks'

import { invokeCommands } from '@configs/invoke-commands'
import { PATHS } from '@configs/paths'

export const HomeScreen: FC = () => {
	const [passwordGenButtonIsDisabled, setPasswordGenButtonIsDisabled] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		checkWindowIsExist('password-generator').then((isExist) => {
			setPasswordGenButtonIsDisabled(isExist)
		})
	}, [])

	useInterval(() => {
		checkWindowIsExist('password-generator').then((isExist) => {
			setPasswordGenButtonIsDisabled(isExist)
		})
	}, 1000)

	const openPasswordGenerator = useInvoke<string>({
		command: invokeCommands.passwordGenerator.open,
		onError: (err) => {
			if (err.status_code === 4000) {
				toast.error('Окно генератора паролей уже открыто')
			}
			setPasswordGenButtonIsDisabled(false)
		},
		onSuccess: () => {
			setPasswordGenButtonIsDisabled(true)
		},
	})
	useListen<string>('new_pass', (data) => {
		toast.success(data.payload)
	})

	const createStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.CREATE}`)
	const openStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.OPEN}`)

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
				<Button
					disabled={passwordGenButtonIsDisabled}
					onClick={async () => await openPasswordGenerator.execute()}
					color='warning'
					variant='text'
					size='large'
					startIcon={<LockKeyhole />}
				>
					Генератор паролей
				</Button>
			</Paper>
		</Box>
	)
}
