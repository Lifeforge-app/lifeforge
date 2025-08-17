import Auth from '@core/pages/Auth'
import RootLayout from '@core/routes/components/RootLayout'
import { NotFoundScreen } from 'lifeforge-ui'
import type { RouteObject } from 'react-router'
import { Navigate } from 'react-router'

import type { ModuleCategory } from '../interfaces/routes_interfaces'
import { shouldModuleBeEnabled } from './moduleFilters'
import { createModuleRoute } from './routeBuilder'

interface CreateRouterConfigOptions {
  routes: ModuleCategory[]
  enabledModules?: string[]
  loadingMessage: string
}

/**
 * Component for handling dashboard redirects with query parameters
 */
export function DashboardRedirectHandler() {
  const searchParams = new URLSearchParams(window.location.search)

  const redirect = searchParams.get('redirect')

  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  return <Navigate replace to="/dashboard" />
}

/**
 * Creates the main router configuration based on authentication state
 */
export function createRouterConfig({
  routes,
  enabledModules = [],
  loadingMessage
}: CreateRouterConfigOptions): RouteObject[] {
  const enabledItems = routes
    .flatMap(category => category.items)
    .filter(item => shouldModuleBeEnabled(item, enabledModules))

  const moduleRoutes = enabledItems.flatMap(item =>
    createModuleRoute(item, loadingMessage)
  )

  return [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        ...moduleRoutes,
        {
          path: '/auth/*',
          element: <DashboardRedirectHandler />
        },
        {
          path: '/',
          element: <Navigate replace to="/dashboard" />
        },
        {
          path: '*',
          element: <NotFoundScreen />
        }
      ]
    }
  ]
}

/**
 * Creates authentication-only router configuration
 */
export function createAuthRouterConfig(): RouteObject[] {
  return [
    {
      path: '/',
      element: <Auth />
    },
    {
      path: '/auth',
      element: <Auth />
    },
    {
      path: '*',
      element: <Navigate replace to="/" />
    }
  ]
}
