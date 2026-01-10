import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DataRouter } from 'shared'
import { createBrowserRouter, useAuth } from 'shared'

import { useFederation } from '@/federation'

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

  const { auth, authLoading } = useAuth()

  const { modules } = useFederation()

  const [appRouter, setAppRouter] = useState<DataRouter | null>(null)

  const loadingRouter = useMemo(
    () => createBrowserRouter(createAuthLoadingConfig()),
    []
  )

  const authRouter = useMemo(
    () => createBrowserRouter(createAuthRouterConfig()),
    []
  )

  useEffect(() => {
    if (authLoading || !auth || modules.length === 0) {
      setAppRouter(null)

      return
    }

    let cancelled = false

    createRouterConfig({
      routes: modules,
      loadingMessage: t('loadingModule')
    }).then(routerConfig => {
      if (!cancelled) {
        setAppRouter(createBrowserRouter(routerConfig))
      }
    })

    return () => {
      cancelled = true
    }
  }, [auth, t, authLoading, modules])

  const router = useMemo(() => {
    if (authLoading) {
      return loadingRouter
    }

    if (!auth) {
      return authRouter
    }

    return appRouter ?? loadingRouter
  }, [auth, authLoading, appRouter, loadingRouter, authRouter])

  return { router, isAuthenticated: !!auth }
}
