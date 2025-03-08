import { save as saveDialog } from '@tauri-apps/plugin-dialog'

import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import { IconButton, InputAdornment, Stack, TextField } from '@mui/material'

import { Eye, EyeOff } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import {
	CreatePasswordStorageSchema,
	createPasswordStorageSchema,
} from '@zod-schemas/password-storage.schema'

import { useInvoke } from '@hooks/useInvoke'

import { PasswordStorageCreate } from '@ts/password-storage'

import { EXTENSION_FILE, EXTENSION_NAME } from '@configs/app'
import { invokeCommands } from '@configs/invoke-commands'
import { PATHS } from '@configs/paths'

import { LoadingButton } from '../ui/loading-button'

export const CreatePasswordStorageForm: FC = () => {
	const navigate = useNavigate()
	const [isKeyVisible, setIsKeyVisible] = useState(false)

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CreatePasswordStorageSchema>({
		resolver: zodResolver(createPasswordStorageSchema),
		mode: 'onChange',
	})

	const createStorage = useInvoke<any, { data: PasswordStorageCreate }>({
		command: invokeCommands.passwordStorage.create,
		onError: (error) => toast.error(error.message),
		onSuccess: (res) => {
			toast.success(res.message)
			reset()
			navigate(`/${PATHS.DASHBOARD.ROOT}`, { replace: true })
		},
	})

	const onSave = async (data: CreatePasswordStorageSchema) => {
		const path = await saveDialog({
			defaultPath: `${data.name}.${EXTENSION_FILE}`,
			filters: [
				{
					name: EXTENSION_NAME,
					extensions: [EXTENSION_FILE],
				},
			],
		})

		if (path) {
			console.log({
				name: data.name,
				description: data.description,
				path,
				master_password: data.masterPassword,
			})
			await createStorage.execute({
				data: {
					name: data.name,
					description: data.description,
					path,
					master_password: data.masterPassword,
				},
			})
		} else {
			toast.error('Путь не выбран')
		}
	}

	return (
		<Stack
			width={'100%'}
			maxHeight={'400px'}
			sx={{
				overflowY: 'auto',
				overflow: 'auto',
				'&::-webkit-scrollbar': { scrollbarWidth: 'thin' },
				'&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: 4 },
				'&::-webkit-scrollbar-track': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: 4 },
				'&::-webkit-scrollbar:horizontal': { height: 4 },
				'&::-webkit-scrollbar:vertical': { width: 4 },
			}}
			component='form'
			onSubmit={handleSubmit(onSave)}
			gap={2}
		>
			<Controller
				name='name'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						autoFocus
						fullWidth
						sx={{
							mt: 0.6,
						}}
						label='Название хранилища паролей'
						error={!!errors.name}
						helperText={errors.name?.message}
						autoComplete='off'
						required
					/>
				)}
			/>

			<Controller
				name='description'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						fullWidth
						label='Описание хранилища паролей'
						multiline
						maxRows={4}
						autoComplete='off'
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
				)}
			/>
			<Controller
				name='masterPassword'
				control={control}
				render={({ field: { ref, ...field } }) => (
					<TextField
						{...field}
						fullWidth
						inputRef={ref}
						autoComplete='off'
						required
						type={isKeyVisible ? 'text' : 'password'}
						label='Ключ шифрования'
						error={!!errors.masterPassword}
						helperText={errors.masterPassword?.message}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={() => setIsKeyVisible(!isKeyVisible)}>
											{isKeyVisible ? <Eye size={24} /> : <EyeOff size={24} />}
										</IconButton>
									</InputAdornment>
								),
							},
						}}
					/>
				)}
			/>
			<LoadingButton
				isLoading={createStorage.isLoading}
				type='submit'
				size='large'
				variant='contained'
				disabled={!isValid || createStorage.isLoading}
			>
				Создать
			</LoadingButton>
		</Stack>
	)
}
