import { Suspense } from 'react'
import type { RouteObject } from 'react-router'

import type {
  FederatedModule,
  ModuleCategory,
  ModuleConfig
} from '@lifeforge/federation'
import { LoadingScreen, ModalManager, ModuleWrapper } from '@lifeforge/ui'

import APIKeyStatusProvider from '@/core/providers/features/APIKeyStatusProvider'

import LazyModuleLoader from '../components/LazyModuleLoader'

interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  isNested?: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  config: {
    name: string
    title: string
    displayName: string
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
  return Object.entries(routes).map(([path, component]) => {
    path = path.startsWith('/') ? path.slice(1) : path

    const Component = component

    return {
      path,
      element: (
        <APIKeyStatusProvider APIKeyAccess={APIKeyAccess}>
          <Suspense
            key={`route-${path}`}
            fallback={<LoadingScreen message={loadingMessage} />}
          >
            <ModuleWrapper config={config}>
              <Component />
              <ModalManager />
            </ModuleWrapper>
          </Suspense>
        </APIKeyStatusProvider>
      )
    }
  })
}

/**
 * Creates route configuration for a module with optional provider wrapper
 */
export function createModuleRoute(
  item: ModuleCategory['items'][number] & { rawModule?: FederatedModule },
  loadingMessage: string
): RouteObject | RouteObject[] {
  if (!item.rawModule) {
    const routeConfig = {
      routes: item.routes,
      APIKeyAccess: item.APIKeyAccess,
      config: {
        name: item.name || '',
        title: item.name,
        displayName: item.displayName,
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
    element: <LazyModuleLoader item={item} loadingMessage={loadingMessage} />
  }
}
