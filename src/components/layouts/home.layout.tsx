import { type FC } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { IconButton, Stack, Tooltip } from '@mui/material'

import { ArrowLeft } from 'lucide-react'

import { PATHS } from '@configs/paths'

export const HomeLayout: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const isHome = pathname === `${PATHS.HOME}`

	return (
		<Stack
			component='section'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				position: 'relative',
				height: '100%',
				width: '100%',
			}}
		> 
			{!isHome && (
				<Tooltip title='Назад'>
					<IconButton sx={{ position: 'absolute', top: 6, left: 6 }} onClick={() => navigate(-1)}>
						<ArrowLeft />
					</IconButton>
				</Tooltip>
			)}
			<Outlet />
		</Stack>
	)
}
