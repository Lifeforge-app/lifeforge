import forgeAPI from '@utils/forgeAPI'
import { LoadingScreen, WithOTP } from 'lifeforge-ui'
import _ from 'lodash'
import { Suspense } from 'react'
import type { RouteObject } from 'react-router'

import type { ForgeAPIClientController } from 'shared/dist/api/core/forgeAPIClient'

import APIKeyStatusProvider from '../../providers/APIKeyStatusProvider'
import type { ModuleConfig } from '../interfaces/routes_interfaces'

interface RouteBuilderOptions {
  routes: ModuleConfig['routes']
  loadingMessage: string
  isNested?: boolean
  otpControllers?: {
    getChallenge: ForgeAPIClientController
    verifyOTP: ForgeAPIClientController
  }
  APIKeys?: string[]
}

/**
 * Builds child routes for a module with proper error boundaries and loading states
 */
export function buildChildRoutes({
  routes,
  isNested = false,
  otpControllers,
  APIKeys = [],
  loadingMessage = 'loadingModule'
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
            <WithOTP
              controllers={
                otpControllers
                  ? {
                      ...otpControllers,
                      generateOTP: forgeAPI.user.auth.generateOTP
                    }
                  : undefined
              }
            >
              <Component />
            </WithOTP>
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
  item: ModuleConfig,
  loadingMessage: string
): RouteObject | RouteObject[] {
  const routeConfig = {
    routes: item.routes,
    APIKeys: item.requiredAPIKeys,
    otpControllers: item.otpControllers,
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
