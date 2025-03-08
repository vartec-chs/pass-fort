import { PATHS } from '@/configs/paths'

import { type FC } from 'react'
import { Outlet, useLocation } from 'react-router'

import { Box } from '@mui/material'

import { AppBar } from '@components/features/appbar'

import { useWindowResize } from '@hooks/useMediaQuery'

export const MainLayout: FC = () => {
	return (
		<Box
			component='main'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100vw',
			}}
		>
			<AppBar />
			<Wrapper>
				<Outlet />
			</Wrapper>
		</Box>
	)
}

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
	const { pathname } = useLocation()
	const isDashboard = pathname.includes(PATHS.DASHBOARD.ROOT)

	const { match } = useWindowResize({
		matches: ({ width, height }) =>
			(width !== null && width >= 800) || (height !== null && height >= 615),
	})

	const { match: dashboardMatch } = useWindowResize({
		matches: ({ width, height }) =>
			(width !== null && width >= 1080) || (height !== null && height >= 615),
	})

	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				height: 'calc(100vh - 30px)',
				width: '100%',
				margin: 'auto',
				// position: 'relative',
				maxHeight: '600px',
				maxWidth: isDashboard ? '1070px' : '800px',
				border: isDashboard ? (dashboardMatch ? 1 : undefined) : match ? 1 : undefined,
				borderColor: theme.palette.divider,
				borderRadius: 4,
			})}
		>
			{children}
		</Box>
	)
}
