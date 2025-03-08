import { useEffect, type FC } from 'react'

import { emit } from '@tauri-apps/api/event'

import { Button, Stack, Typography } from '@mui/material'

const sendPassword = async () => {
	await emit('new_pass', 'SuperSecret123!')
}

export const PasswordGeneratorScreen: FC = () => {

	useEffect(() => {
    console.log("✅ PasswordGeneratorScreen загружен!");
    console.log("📍 URL: ", window.location.href);
  }, []);
	return (
		<Stack>
			<Typography variant='h4' fontWeight={600}>
				Генератор паролей
			</Typography>

			<Button onClick={sendPassword} variant='contained' size='large'>
				Сгенерировать
			</Button>
		</Stack>
	)
}
