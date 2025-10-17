import APIKeyStatusProvider from '@/providers/APIKeyStatusProvider'
import { LoadingScreen, ModalManager, ModuleWrapper } from 'lifeforge-ui'
import _ from 'lodash'
import { Suspense } from 'react'
import type { RouteObject } from 'react-router'
import type { ModuleConfig } from 'shared'

interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  isNested?: boolean
  APIKeys?: string[]
  config: {
    title: string
    icon: string
  }
}

/**
 * Builds child routes for a module with proper error boundaries and loading states
 */
export function buildChildRoutes({
  routes,
  isNested = false,
  APIKeys = [],
  loadingMessage = 'loadingModule',
  config
}: RouteBuilderOptions): RouteObject[] {
  return Object.entries(routes).map(([path, component]) => {
    const Component = component

    const routePath = isNested ? path : `/${path}`

    return {
      path: routePath,
      element: (
        <APIKeyStatusProvider APIKeys={APIKeys}>
          <Suspense
            key={`route-${path}`}
            fallback={<LoadingScreen customMessage={loadingMessage} />}
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
    APIKeys: item.requiredAPIKeys,
    config: {
      title: item.name,
      icon: item.icon
    },
    loadingMessage
  }

  if (item.provider) {
    const Provider = item.provider

    return {
      path: `/${_.kebabCase(item.name)}`,
      element: <Provider />,
      children: buildChildRoutes({
        ...routeConfig,
        isNested: true
      })
    }
  }

  return buildChildRoutes(routeConfig)
}
