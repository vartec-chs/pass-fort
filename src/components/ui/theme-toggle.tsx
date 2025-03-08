import { FC } from 'react'

import { colors, IconButton, Tooltip } from '@mui/material'

import { MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@providers/theme-providers'

interface ThemeToggleProps {
	size?: number
}

export const ThemeToggle: FC<ThemeToggleProps> = ({ size = 24 }) => {
	const { theme, setTheme } = useTheme()

	return (
		<Tooltip title={theme === 'light' ? 'Светлая тема' : 'Темная тема'}>
			<IconButton
				size={'small'}
				color='inherit'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			>
				{theme === 'light' ? (
					<MoonIcon fill={colors.blue[500]} size={size} />
				) : (
					<SunIcon fill={colors.yellow[700]} size={size} />
				)}
			</IconButton>
		</Tooltip>
	)
}
