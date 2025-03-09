import { type FC } from 'react'

import { emit } from '@tauri-apps/api/event'

import { Stack, Typography } from '@mui/material'

import { PasswordGeneratorForm } from '@components/forms/password-generator-form'

const sendPassword = async (password: string) => {
	await emit('new_pass', password)
}

export const PasswordGeneratorScreen: FC = () => {
	return (
		<Stack p={2} component='section' gap={2} height={'100%'}>
			<Typography component='h1' textAlign={'center'} variant='h4' fontWeight={600}>
				Генератор паролей
			</Typography>

			<PasswordGeneratorForm onPasswordGenerate={sendPassword} />
		</Stack>
	)
}
