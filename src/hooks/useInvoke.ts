import { useEffect, useState } from 'react'

import { invoke } from '@tauri-apps/api/core'

type ApiResult<T = unknown> = {
	data: T
	message: string
	status_code: number
	is_success: boolean
}

type InvokeArgs = {
	[key: string]: any
}

interface UseInvoke<Return, Params extends InvokeArgs> {
	command: string
	invokeArgs?: Params
	isSelfCalling?: boolean
	onSuccess?: (data: ApiResult<Return>) => void
	onError?: (error: ApiResult<Return>) => void
	onFinished?: () => void
}

interface UseInvokeReturn<Return, Params extends InvokeArgs> {
	data: ApiResult<Return> | undefined
	isLoading: boolean
	error: ApiResult<Return> | undefined
	execute: (invokeArgs?: Params) => Promise<void>
}

export const useInvoke = <Return, Params extends InvokeArgs = {}>({
	command,
	...args
}: UseInvoke<Return, Params>): UseInvokeReturn<Return, Params> => {
	const [data, setData] = useState<ApiResult<Return> | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<ApiResult<Return> | undefined>(undefined)

	const execute = async (invokeArgs?: Params) => {
		setIsLoading(true)

		await invoke<ApiResult<Return>>(command, args?.invokeArgs || invokeArgs)
			.then((data) => {
				setData(data)
				args?.onSuccess?.(data)
			})
			.catch((error: ApiResult<Return>) => {
				setError(error)
				args?.onError?.(error)
			})
			.finally(() => {
				setIsLoading(false)
				args?.onFinished?.()
			})
	}

	useEffect(() => {
		if (args?.isSelfCalling) {
			const executeData = async () => {
				await execute()
			}

			executeData()
		}
	}, [])

	return {
		data,
		isLoading,
		error,
		execute,
	}
}
