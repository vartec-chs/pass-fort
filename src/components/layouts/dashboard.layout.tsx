import { type FC, useState } from 'react'
import { Outlet } from 'react-router'

import {
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	styled,
	Tooltip,
	useTheme,
} from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon, InboxIcon, MailIcon, MenuIcon } from 'lucide-react'

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}))

export const DashboardLayout: FC = () => {
	const theme = useTheme()
	const [open, setOpen] = useState(false)

	const handleDrawerOpen = () => setOpen(true)
	const handleDrawerClose = () => setOpen(false)
	return (
		<Stack
			component='section'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				position: 'relative',
				overflow: 'hidden',
				height: '100%',
				width: '100%',
			}}
		>
			<IconButton
				sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2000 }}
				onClick={() => setOpen(!open)}
			>
				<MenuIcon />
			</IconButton>
			<Drawer
			
				sx={{
					'& .MuiDrawer-root': {
						position: 'absolute',
					
					},
					'& .MuiPaper-root': {
						position: "absolute",
						borderRadius: '20px  0 0 20px',
					},
			
					width: '300px',
					flexShrink: 0,
					'& .MuiDrawer-paper': { width: '300px', boxSizing: 'border-box' },
				}}
				variant='persistent'
				anchor='left'
				open={open}
			>
				<DrawerHeader></DrawerHeader>
				<Divider />
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{['All mail', 'Trash', 'Spam'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Outlet />
		</Stack>
	)
}
