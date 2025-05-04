import { Suspense } from 'react'
import { Route } from 'react-router'

import { LoadingScreen } from '@lifeforge/ui'

import ModalManager from '../../modals/ModalManager'
import { RouteItem } from '../interfaces/routes_interfaces'
import APIKeyStatusProvider from '../providers/APIKeyStatusProvider'

function ChildRoutesRenderer({
  routes,
  isNested = false,
  APIKeys = [],
  t
}: {
  routes: RouteItem['routes']
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
