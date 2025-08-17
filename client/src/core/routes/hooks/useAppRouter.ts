import { useAuth } from '@providers/AuthProvider'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter } from 'react-router'

import ROUTES from '../Routes'
import {
  createAuthLoadingConfig,
  createAuthRouterConfig,
  createRouterConfig
} from '../utils/routerFactory'

/**
 * Custom hook that creates and manages the application router
 * based on authentication state and user preferences
 */
export function useAppRouter() {
  const { t } = useTranslation('common.misc')

  const { userData, auth, authLoading } = useAuth()

  const router = useMemo(() => {
    if (authLoading) {
      // If authentication is still loading, return a placeholder router
      return createBrowserRouter(createAuthLoadingConfig())
    }

    // If user is not authenticated, return auth-only routes
    if (!auth) {
      return createBrowserRouter(createAuthRouterConfig())
    }

    // If user is authenticated, create full application routes
    // based on enabled modules
    const routerConfig = createRouterConfig({
      routes: ROUTES,
      enabledModules: userData?.enabledModules ?? [],
      loadingMessage: t('loadingModule')
    })

    return createBrowserRouter(routerConfig)
  }, [userData?.enabledModules, auth, t])

  return { router, isAuthenticated: !!auth }
}
