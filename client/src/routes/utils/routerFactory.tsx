import { LoadingScreen, NotFoundScreen } from 'lifeforge-ui'
import type { RouteObject } from 'shared'
import { Navigate } from 'shared'
import type { ModuleCategory } from 'shared'

import Auth from '../../auth'
import RootLayout from '../components/RootLayout'
import { createModuleRoute } from './routeBuilder'

interface CreateRouterConfigOptions {
  routes: ModuleCategory[]
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

export function AuthRedirectHandler() {
  const { pathname, search, hash } = window.location

  const fullPath = `${pathname}${search}${hash}`

  return (
    <Navigate replace to={`/auth?redirect=${encodeURIComponent(fullPath)}`} />
  )
}

/**
 * Creates the main router configuration based on authentication state
 */
export function createRouterConfig({
  routes,
  loadingMessage
}: CreateRouterConfigOptions): RouteObject[] {
  const enabledItems = routes
    .flatMap(category => category.items)
    .filter(item => !item.disabled)

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
      element: <AuthRedirectHandler />
    }
  ]
}

/**
 * Creates a loading screen configuration for when session token is being verified
 */
export function createAuthLoadingConfig(): RouteObject[] {
  return [
    {
      path: '*',
      element: <LoadingScreen customMessage="Loading user data..." />
    }
  ]
}
