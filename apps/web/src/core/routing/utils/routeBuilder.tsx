import { Suspense } from 'react'
import type { RouteObject } from 'react-router'

import type { ModuleConfig, ModuleGroup } from '@lifeforge/configs'
import type { FederatedModule } from '@lifeforge/federation'
import {
  LoadingScreen,
  ModalManager,
  ModuleWrapper,
  NotFoundScreen
} from '@lifeforge/ui'

import APIKeyStatusProvider from '@/core/providers/features/APIKeyStatusProvider'

import LazyRouteLoader from '../components/LazyRouteLoader'

export interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  config: {
    name: string
    title: string
    icon: string
    clearQueryOnUnmount: boolean
  }
}

/**
 * Builds child routes for a module with proper error boundaries and loading states
 */
export function buildChildRoutes({
  routes,
  APIKeyAccess,
  loadingMessage = 'loadingModule',
  config
}: RouteBuilderOptions): RouteObject[] {
  const childRoutes: RouteObject[] = Object.entries(routes).map(
    ([path, Component]) => ({
      path,
      element: (
        <APIKeyStatusProvider APIKeyAccess={APIKeyAccess}>
          <Suspense
            key={`route-${path.startsWith('/') ? path.slice(1) : path}`}
            fallback={<LoadingScreen message={loadingMessage} />}
          >
            <ModuleWrapper config={config}>
              <Component />
              <ModalManager />
            </ModuleWrapper>
          </Suspense>
        </APIKeyStatusProvider>
      )
    })
  )

  childRoutes.push({
    path: '*',
    element: <NotFoundScreen />
  })

  return childRoutes
}

/**
 * Creates route configuration for a module with optional provider wrapper
 */
export function createModuleRoute(
  item: ModuleGroup['items'][number] & { rawModule?: FederatedModule },
  loadingMessage: string
): RouteObject | RouteObject[] {
  if (!item.rawModule) {
    const routeConfig = {
      routes: item.routes,
      APIKeyAccess: item.APIKeyAccess,
      config: {
        name: item.name || '',
        title: item.name,
        icon: item.icon,
        clearQueryOnUnmount: item.clearQueryOnUnmount ?? true
      },
      loadingMessage
    }

    const strippedName = item.name.replace(/^@[^/]+\//, '')

    return {
      path: `/${strippedName.startsWith('lifeforge--') ? strippedName.split('--')[1] : strippedName}`,
      children: buildChildRoutes(routeConfig)
    }
  }

  const strippedName = item.name.replace(/^@[^/]+\//, '')
  const baseRoute = strippedName.startsWith('lifeforge--')
    ? strippedName.split('--')[1]
    : strippedName

  return {
    path: `/${baseRoute}/*`,
    element: <LazyRouteLoader item={item} loadingMessage={loadingMessage} />
  }
}
