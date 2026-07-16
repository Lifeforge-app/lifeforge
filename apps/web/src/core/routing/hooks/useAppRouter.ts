import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DataRouter, createBrowserRouter } from 'react-router'

import { useAuth } from '@lifeforge/api'
import { useFederation } from '@lifeforge/federation'

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
  const [routerId, setRouterId] = useState(0)

  const loadingRouter = useMemo(
    () => createBrowserRouter(createAuthLoadingConfig()),
    []
  )
  const authRouter = useMemo(
    () => createBrowserRouter(createAuthRouterConfig()),
    []
  )
  useEffect(() => {
    if (authLoading || !auth || modulesLoading || modules.length === 0) {
      return
    }

    let cancelled = false

    createRouterConfig({
      routes: modules,
      loadingMessage: t('loadingModule')
    }).then(routerConfig => {
      if (!cancelled) {
        setAppRouter(createBrowserRouter(routerConfig))
        setRouterId(id => id + 1)
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
  }, [
    auth,
    authLoading,
    modulesLoading,
    modules,
    appRouter,
    loadingRouter,
    authRouter
  ])

  const routerKey = useMemo(() => {
    if (authLoading || modulesLoading || (auth && modules.length === 0)) {
      return 'loading'
    }

    if (!auth) {
      return 'auth'
    }

    return appRouter ? `app-${routerId}` : 'loading'
  }, [auth, authLoading, modulesLoading, modules, appRouter, routerId])

  return { router, isAuthenticated: !!auth, routerKey }
}
