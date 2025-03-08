import { createRoot } from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RouterProvider } from '@providers/router-provider'
import { ThemeProvider } from '@providers/theme-providers'
import { ToastsProvider } from '@providers/toasts-provider'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<ThemeProvider>
		<ToastsProvider />
		<QueryClientProvider client={queryClient}>
			<RouterProvider />
		</QueryClientProvider>
	</ThemeProvider>,
)
