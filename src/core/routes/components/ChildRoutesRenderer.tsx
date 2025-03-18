import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route } from 'react-router'

import { LoadingScreen } from '@lifeforge/ui'

import APIKeyStatusProvider from '../../lib/APIKeys/providers/APIKeyStatusProvider'
import { RouteItem } from '../interfaces/routes_interfaces'

function ChildRoutesRenderer({
  routes,
  isNested = false,
  APIKeys = []
}: {
  routes: RouteItem['routes']
  isNested?: boolean
  APIKeys?: string[]
}) {
  const { t } = useTranslation('common.misc')

  return Object.entries(routes).map(([path, component]) => {
    const Comp = component

    return (
      <Route
        key={`path-${path}`}
        element={
          <APIKeyStatusProvider APIKeys={APIKeys}>
            <Suspense
              key={`path-${path}`}
              fallback={
                <LoadingScreen customMessage={t('common.misc:loadingModule')} />
              }
            >
              <Comp />
            </Suspense>
          </APIKeyStatusProvider>
        }
        path={(!isNested ? '/' : '') + path}
      />
    )
  })
}

export default ChildRoutesRenderer
