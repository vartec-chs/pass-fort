import { HomeLayout } from '@/components/layouts/home.layout'

import { type FC, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import { DashboardLayout } from '@components/layouts/dashboard.layout'
import { MainLayout } from '@components/layouts/main.layout'

import { DashboardScreen } from '@screens/dashboard'
import { HomeScreen } from '@screens/home.screen'
import { PasswordGeneratorScreen } from '@screens/password-generator.screen'
import { PasswordStorageScreen } from '@screens/password-storage.screen'

import { PATHS } from '@configs/paths'

export const RouterProvider: FC = () => {
	useEffect(() => {
		console.log(window.location.pathname)
	}, [])
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path={PATHS.HOME} element={<HomeLayout />}>
						<Route index element={<HomeScreen />} />

						<Route path={PATHS.PASSWORD_STORAGE.CREATE} element={<PasswordStorageScreen />} />
						<Route path={PATHS.PASSWORD_STORAGE.OPEN} element={<PasswordStorageScreen />} />
					</Route>

					<Route path={PATHS.DASHBOARD.ROOT} element={<DashboardLayout />}>
						<Route index element={<DashboardScreen />} />
					</Route>
					<Route path={PATHS.PASSWORD_GENERATOR} element={<PasswordGeneratorScreen />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
