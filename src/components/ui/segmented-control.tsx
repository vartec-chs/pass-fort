
import { colors } from '@mui/material'

import { styled, Tab, TabProps, Tabs, TabsProps } from '@mui/material'

export const SegmentedControl = styled((props: TabsProps) => <Tabs {...props} />)(({ theme, sx, style }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[200],
	padding: '0.3rem',
	borderRadius: '1.15rem',
	textTransform: 'none',
	height:  style?.height || '100%' , 
	'& .MuiTab-root': {
		minHeight: 'auto',
	},

	'& .MuiTabs-flexContainer': {
		gap: '0.1rem',
	},

	'& .MuiTabs-indicator': {
		backgroundColor: theme.palette.primary.dark,
		height: '100%',

		zIndex: 2,
		borderRadius: '1rem',
	},
}))

export const Segment = styled((props: TabProps) => <Tab {...props} />)(({ theme }) => ({
	fontSize: '0.9rem',
	borderRadius: '1rem',
	zIndex: 3,
	textTransform: 'none',
	transition: 'all 0.2s linear',
	height: 'fit-content',

	'&.Mui-selected': {
		color: 'white',

		transition: 'all 0s linear',
	},
	'&:hover:not(.Mui-selected)': {
		backgroundColor: theme.palette.primary.dark[800],
	},
}))
