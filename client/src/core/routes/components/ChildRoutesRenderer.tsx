import { LoadingScreen, ModalManager } from 'lifeforge-ui'
import { Suspense } from 'react'
import type { RouteObject } from 'react-router'

import type { ModuleConfig } from '../interfaces/routes_interfaces'
import APIKeyStatusProvider from '../providers/APIKeyStatusProvider'

function ChildRoutesRenderer({
  routes,
  isNested = false,
  APIKeys = [],
  loadingMessage = 'loadingModule'
}: {
  routes: ModuleConfig['routes']
  loadingMessage: any
  isNested?: boolean
  APIKeys?: string[]
}): RouteObject[] {
  return Object.entries(routes).map(([path, component]) => {
    const Comp = component

    return {
      path: (!isNested ? '/' : '') + path,
      element: (
        <APIKeyStatusProvider APIKeys={APIKeys}>
          <Suspense
            key={`path-${path}`}
            fallback={<LoadingScreen customMessage={loadingMessage} />}
          >
            <Comp />
          </Suspense>
          <ModalManager />
        </APIKeyStatusProvider>
      )
    }
  })
}

export default ChildRoutesRenderer
