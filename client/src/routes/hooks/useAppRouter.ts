import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DataRouter } from 'shared'
import { createBrowserRouter, useAuth, useFederation } from 'shared'

import {
  createAuthLoadingConfig,
  createAuthRouterConfig,
  createRouterConfig
} from '../utils/routerFactory'

export function useAppRouter() {
  const { t } = useTranslation('common.misc')

  const { auth, authLoading } = useAuth()

  const { modules, loading: modulesLoading } = useFederation()

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
    if (authLoading || !auth || modulesLoading) {
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
  }, [auth, t, authLoading, modules, modulesLoading])

  const router = useMemo(() => {
    if (authLoading || modulesLoading) {
      return loadingRouter
    }

    if (!auth) {
      return authRouter
    }

    return appRouter ?? loadingRouter
  }, [auth, authLoading, modulesLoading, appRouter, loadingRouter, authRouter])

  return { router, isAuthenticated: !!auth }
}
