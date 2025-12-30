import { LoadingScreen, ModalManager, ModuleWrapper } from 'lifeforge-ui'
import _ from 'lodash'
import { Suspense } from 'react'
import type { RouteObject } from 'shared'
import type { ModuleConfig } from 'shared'

import APIKeyStatusProvider from '@/providers/features/APIKeyStatusProvider'

interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  isNested?: boolean
  APIKeyAccess?: ModuleConfig['APIKeyAccess']
  config: {
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
  item: ModuleConfig,
  loadingMessage: string
): RouteObject | RouteObject[] {
  const routeConfig = {
    routes: item.routes,
    APIKeyAccess: item.APIKeyAccess,
    config: {
      title: item.name,
      icon: item.icon,
      clearQueryOnUnmount: item.clearQueryOnUnmount ?? true
    },
    loadingMessage
  }

  if (item.provider) {
    const Provider = item.provider

    return {
      path: `/${_.kebabCase(item.name)}`,
      element: <Provider />,
      children: buildChildRoutes(routeConfig)
    }
  }

  return {
    path: `/${_.kebabCase(item.name)}`,
    children: buildChildRoutes(routeConfig)
  }
}
