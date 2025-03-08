import { Components, createTheme, CssVarsTheme, Theme } from '@mui/material'

const components: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> | undefined = {
	MuiTextField: {
		styleOverrides: {
			root: {
				'& .MuiOutlinedInput-root': {
					borderRadius: 12,
				},
			},
		},
	},

	MuiButton: {
		styleOverrides: {
			root: {
				borderRadius: 8,
			},
		},
	},

	MuiCssBaseline: {
		styleOverrides: {},
	},
}

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#226aff',
			900: '#3630cc',
			800: '#2c57ec',
			700: '#226aff',
			600: '#047eff',
			500: '#008eff',
			400: '#149fff',
			300: '#50b1ff',
			200: '#89c8ff',
			100: '#b9ddff',
			50: '#e2f2ff',
		},
		secondary: {
			main: '#505050',
			900: '#303030',
			800: '#404040',
			700: '#505050',
			600: '#606060',
			500: '#707070',
			400: '#808080',
			300: '#909090',
			200: '#a0a0a0',
			100: '#b0b0b0',
			50: '#c0c0c0',
		},
	},
	components,
})

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#226aff',
			900: '#3630cc',
			800: '#2c57ec',
			700: '#226aff',
			600: '#047eff',
			500: '#008eff',
			400: '#149fff',
			300: '#50b1ff',
			200: '#89c8ff',
			100: '#b9ddff',
			50: '#e2f2ff',
		},
		secondary: {
			main: '#b0b0b0',
			900: '#909090',
			800: '#989898',
			700: '#a0a0a0',
			600: '#a8a8a8',
			500: '#b0b0b0',
			400: '#b8b8b8',
			300: '#c0c0c0',
			200: '#c8c8c8',
			100: '#d0d0d0',
			50: '#e0e0e0',
		},
	},
	components,
})
