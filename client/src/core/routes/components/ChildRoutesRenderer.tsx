import { LoadingScreen, ModalManager } from 'lifeforge-ui'
import { Suspense } from 'react'
import { Route } from 'react-router'

import type { ModuleConfig } from '../interfaces/routes_interfaces'
import APIKeyStatusProvider from '../providers/APIKeyStatusProvider'

function ChildRoutesRenderer({
  routes,
  isNested = false,
  APIKeys = [],
  t
}: {
  routes: ModuleConfig['routes']
  t: any
  isNested?: boolean
  APIKeys?: string[]
}) {
  return Object.entries(routes).map(([path, component]) => {
    const Comp = component

    return (
      <Route
        key={`path-${path}`}
        element={
          <APIKeyStatusProvider APIKeys={APIKeys}>
            <Suspense
              key={`path-${path}`}
              fallback={<LoadingScreen customMessage={t('loadingModule')} />}
            >
              <Comp />
            </Suspense>
            <ModalManager />
          </APIKeyStatusProvider>
        }
        path={(!isNested ? '/' : '') + path}
      />
    )
  })
}

export default ChildRoutesRenderer
