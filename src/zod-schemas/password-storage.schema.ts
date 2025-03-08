import { EXTENSION_FILE } from '@/configs/app'

import * as z from 'zod'

export const createPasswordStorageSchema = z.object({
	name: z
		.string({
			message: 'Название хранилища паролей должно быть строкой',
		})
		.describe('Название хранилища паролей'),
	description: z
		.string({
			message: 'Описание хранилища паролей должно быть строкой',
		})
		.describe('Описание хранилища паролей')
		.optional(),
	masterPassword: z
		.string({
			message: 'Ключ шифрования должен быть строкой',
		})
		.describe('Ключ шифрования'),
})

export const openPasswordStorageSchema = z.object({
	path: z
		.string({
			message: 'Путь к базе данных должен быть строкой',
		})
		.describe('Путь к базе данных')
		.refine(
			(value) => value.endsWith(EXTENSION_FILE),
			`Путь к базе данных должен заканчиваться ${EXTENSION_FILE}`,
		),
	masterPassword: z
		.string({
			message: 'Ключ шифрования должен быть строкой',
		})
		.describe('Ключ шифрования'),
})

export type CreatePasswordStorageSchema = z.infer<typeof createPasswordStorageSchema>
export type OpenPasswordStorageSchema = z.infer<typeof openPasswordStorageSchema>
