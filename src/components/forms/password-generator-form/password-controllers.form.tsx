import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
	Button,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Switch,
	TextField,
	Tooltip,
} from '@mui/material'

import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

// Полное перечисление символов, букв и цифр
const CHARACTER_SETS = {
	symbols: `!"#$%&'()*+,-./:;<=>?@[\\]^_{|}~\``, // Добавлен `
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	digits: '0123456789',
}

// Zod-схема валидации
const schema = z
	.object({
		symbols: z.object({
			enabled: z.boolean(),
			value: z
				.string()
				.regex(/^[\W_]*$/, 'Только символы!')
				.min(1, 'Не менее 1 символа!'),
			title: z.string(),
		}),
		uppercase: z.object({
			enabled: z.boolean(),
			value: z
				.string()
				.regex(/^[A-Z]*$/, 'Только заглавные буквы!')
				.min(1, 'Не менее 1 заглавной буквы!'),
			title: z.string(),
		}),
		lowercase: z.object({
			enabled: z.boolean(),
			value: z
				.string()
				.regex(/^[a-z]*$/, 'Только строчные буквы!')
				.min(1, 'Не менее 1 строчной буквы!'),
			title: z.string(),
		}),
		digits: z.object({
			enabled: z.boolean(),
			value: z
				.string()
				.regex(/^[0-9]*$/, 'Только цифры!')
				.min(1, 'Не менее 1 цифры!'),
			title: z.string(),
		}),
	})
	.refine((data) => Object.values(data).some((item) => item.enabled), {
		message: 'Хотя бы один переключатель должен быть включен!',
		path: ['root'],
	})

interface PasswordControllersFormProps {
	onChange: (values: {
		symbols: { enabled: boolean; value: string }
		uppercase: { enabled: boolean; value: string }
		lowercase: { enabled: boolean; value: string }
		digits: { enabled: boolean; value: string }
	}) => void
}

export const PasswordControllersForm: React.FC<PasswordControllersFormProps> = ({ onChange }) => {
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'all',
		resolver: zodResolver(schema),
		defaultValues: {
			symbols: { enabled: true, value: CHARACTER_SETS.symbols, title: 'Символы' },
			uppercase: { enabled: false, value: CHARACTER_SETS.uppercase, title: 'Заглавные буквы' },
			lowercase: { enabled: false, value: CHARACTER_SETS.lowercase, title: 'Строчные буквы' },
			digits: { enabled: false, value: CHARACTER_SETS.digits, title: 'Цифры' },
		},
	})

	// Следим за всеми значениями формы и отправляем их в родительский компонент
	const values = watch()
	useState(() => {
		onChange(values)
	})

	const [editing, setEditing] = useState<{ [key: string]: boolean }>({
		symbols: false,
		uppercase: false,
		lowercase: false,
		digits: false,
	})

	// Функция для блокировки последнего переключателя, если все остальные выключены
	const isLastSwitchEnabled = Object.values(values).filter((item) => item.enabled).length === 1

	return (
		<FormGroup>
			{Object.keys(CHARACTER_SETS).map((key) => (
				<Controller
					key={key}
					name={key as keyof typeof CHARACTER_SETS}
					control={control}
					render={({ field }) => (
						<div>
							{editing[key] ? (
								<TextField
									label={field.value.title}
									fullWidth
									autoFocus
									value={field.value.value}
									onChange={(e) => {
										field.onChange({ ...field.value, value: e.target.value })
										// onChange(watch()) // Обновляем родительский компонент
									}}
									onBlur={() => {
										setEditing((prev) => ({ ...prev, [key]: false }))
										if (Boolean(errors[key as keyof typeof CHARACTER_SETS])) {
											setValue(key as keyof typeof CHARACTER_SETS, {
												...field.value,
												value: CHARACTER_SETS[key as keyof typeof CHARACTER_SETS],
											})
										}
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !Boolean(errors[key as keyof typeof CHARACTER_SETS])) {
											setEditing((prev) => ({ ...prev, [key]: false }))
											onChange(watch())
										}
									}}
									size='small'
									error={!!errors[key as keyof typeof CHARACTER_SETS]}
									helperText={errors[key as keyof typeof CHARACTER_SETS]?.value?.message as string}
								/>
							) : (
								<Tooltip title='Двойной клик для редактирования'>
									<FormControlLabel
										control={
											<Switch
												checked={field.value.enabled}
												onChange={(e) => {
													field.onChange({ ...field.value, enabled: e.target.checked })
													onChange(watch()) // Обновляем родительский компонент
												}}
												disabled={isLastSwitchEnabled && field.value.enabled} // Блокируем последний переключатель
											/>
										}
										label={field.value.value} // Отображаем только значение
										onDoubleClick={() => setEditing((prev) => ({ ...prev, [key]: true }))}
									/>
								</Tooltip>
							)}
						</div>
					)}
				/>
			))}
			{errors.root && (
				<FormHelperText error sx={{ mt: 1 }}>
					{errors.root.message}
				</FormHelperText>
			)}
		</FormGroup>
	)
}
