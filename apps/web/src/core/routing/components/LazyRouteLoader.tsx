import { useEffect, useState } from 'react'
import { useRoutes } from 'react-router'

import type { ModuleGroup } from '@lifeforge/configs'
import {
  type FederatedModule,
  loadRemoteModuleConfig
} from '@lifeforge/federation'
import { ErrorScreen, LoadingScreen } from '@lifeforge/ui'

import { devModeImports, devModePkgs } from '@/core/utils/devModeImports'

import { buildChildRoutes } from '../utils/routeBuilder'

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

  const config = {
    name: item.name || '',
    title: item.name,
    icon: item.icon,
    clearQueryOnUnmount: item.clearQueryOnUnmount ?? true
  }

  const routesElement = useRoutes(
    buildChildRoutes({
      routes: resolvedRoutes || {},
      APIKeyAccess: item.APIKeyAccess,
      loadingMessage,
      config
    })
  )

  if (error) {
    return <ErrorScreen message={error} />
  }

  if (!resolvedRoutes) {
    return <LoadingScreen message={loadingMessage} />
  }

  return routesElement
}
