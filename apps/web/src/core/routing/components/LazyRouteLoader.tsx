import { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'

import type { ModuleGroup } from '@lifeforge/configs'
import {
  type FederatedModule,
  loadRemoteModuleConfig
} from '@lifeforge/federation'
import {
  ErrorScreen,
  LoadingScreen,
  ModalManager,
  ModuleWrapper
} from '@lifeforge/ui'

import APIKeyStatusProvider from '@/core/providers/features/APIKeyStatusProvider'
import { devModeImports, devModePkgs } from '@/core/utils/devModeImports'

export default function LazyRouteLoader({
  item,
  loadingMessage
}: {
  item: ModuleGroup['items'][number] & { rawModule?: FederatedModule }
  loadingMessage: string
}) {
  const [resolvedRoutes, setResolvedRoutes] = useState<Record<
    string,
    any
  > | null>(null)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!item.rawModule) return

      try {
        const unwrapped = await loadRemoteModuleConfig(
          item.rawModule,
          devModeImports,
          devModePkgs
        )

        if (!active) return

        setResolvedRoutes(unwrapped.routes || {})
      } catch (err) {
        if (!active) return

        setError(err instanceof Error ? err.message : 'Failed to load module')
      }
    }
    load()

    return () => {
      active = false
    }
  }, [item])

  if (error) {
    return <ErrorScreen message={error} />
  }

  if (!resolvedRoutes) {
    return <LoadingScreen message={loadingMessage} />
  }

  const config = {
    name: item.name || '',
    title: item.name,
    icon: item.icon,
    clearQueryOnUnmount: item.clearQueryOnUnmount ?? true
  }

  return (
    <Routes>
      {Object.entries(resolvedRoutes).map(([path, component]) => {
        const Component = component
        const cleanPath = path.startsWith('/') ? path.slice(1) : path

        return (
          <Route
            key={cleanPath}
            element={
              <APIKeyStatusProvider APIKeyAccess={item.APIKeyAccess}>
                <Suspense fallback={<LoadingScreen message={loadingMessage} />}>
                  <ModuleWrapper config={config}>
                    <Component />
                    <ModalManager />
                  </ModuleWrapper>
                </Suspense>
              </APIKeyStatusProvider>
            }
            path={cleanPath}
          />
        )
      })}
    </Routes>
  )
}
