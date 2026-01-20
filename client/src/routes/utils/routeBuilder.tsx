import { LoadingScreen, ModalManager, ModuleWrapper } from 'lifeforge-ui'
import { Suspense } from 'react'
import type { ModuleCategory, RouteObject } from 'shared'
import type { ModuleConfig } from 'shared'

import APIKeyStatusProvider from '@/providers/features/APIKeyStatusProvider'

interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  isNested?: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  config: {
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
            </ModuleWrapper>
          </Suspense>
          <ModalManager />
        </APIKeyStatusProvider>
      )
    }
  })
}

/**
 * Creates route configuration for a module with optional provider wrapper
 */
export function createModuleRoute(
  item: ModuleCategory['items'][number],
  loadingMessage: string
): RouteObject | RouteObject[] {
  const routeConfig = {
    routes: item.routes,
    APIKeyAccess: item.APIKeyAccess,
    config: {
      title: item.name,
      displayName: item.displayName,
      icon: item.icon,
      clearQueryOnUnmount: item.clearQueryOnUnmount ?? true
    },
    loadingMessage
  }

  return {
    path: `/${item.name.startsWith('lifeforge--') ? item.name.split('--')[1] : item.name}`,
    children: buildChildRoutes(routeConfig)
  }
}
