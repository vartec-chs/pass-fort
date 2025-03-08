import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Box, Paper, Stack } from '@mui/material'

import { CreatePasswordStorageForm } from '@/components/forms/create-password-storage.form'
import { OpenPasswordStorageForm } from '@components/forms/open-password-storage.form'
import { Segment, SegmentedControl } from '@components/ui/segmented-control'

import { PATHS } from '@configs/paths'

export const PasswordStorageScreen: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const switchPage = () => {
		if (pathname.includes(PATHS.PASSWORD_STORAGE.CREATE)) {
			navigate(`/${PATHS.PASSWORD_STORAGE.OPEN}`, {
				replace: true,
			})
		} else {
			navigate(`/${PATHS.PASSWORD_STORAGE.CREATE}`, {
				replace: true,
			})
		}
	}

	const component = () => {
		if (pathname.includes(PATHS.PASSWORD_STORAGE.CREATE)) {
			return <CreatePasswordStorageForm />
		} else {
			return <OpenPasswordStorageForm />
		}
	}

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
				gap: 2,
			}}
		>
			<SegmentedControl sx={{ height: '50px' }} onChange={switchPage} value={pathname}>
				<Segment value={`/${PATHS.PASSWORD_STORAGE.CREATE}`} label='Создать' />
				<Segment value={`/${PATHS.PASSWORD_STORAGE.OPEN}`} label='Открыть' />
			</SegmentedControl>
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
					width={'100%'}
					component='div'
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{component()}
				</Stack>
			</Paper>
		</Box>
	)
}
