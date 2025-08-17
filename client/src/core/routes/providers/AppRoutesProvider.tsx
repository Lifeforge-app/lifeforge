import Auth from '@core/pages/Auth'
import RootLayout from '@core/routes/components/RootLayout'
import { useAuth } from '@providers/AuthProvider'
import { LoadingScreen, ModalManager, NotFoundScreen } from 'lifeforge-ui'
import _ from 'lodash'
import { Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
  useLocation
} from 'react-router'

import ROUTES from '../Routes'
import type { ModuleConfig } from '../interfaces/routes_interfaces'
import APIKeyStatusProvider from '../../providers/APIKeyStatusProvider'

function NavigateToDashBoardWithRedirect() {
  const { search } = useLocation()

  if (search) {
    const params = new URLSearchParams(search)

    const redirect = params.get('redirect')

    if (redirect) {
      return <Navigate replace to={redirect} />
    }
  }

  return <Navigate replace to="/dashboard" />
}

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

function AppRoutesProvider() {
  const { t } = useTranslation('common.misc')

  const { userData, auth } = useAuth()

  const router = useMemo(() => {
    if (!auth) {
      return createBrowserRouter([
        {
          path: '/',
          element: <Auth />
        },
        {
          path: '/auth',
          element: <Auth />
        },
        {
          path: '*',
          element: <Navigate replace to="/" />
        }
      ])
    }

    return createBrowserRouter([
      {
        path: '/',
        element: <RootLayout />,
        children: ROUTES.flatMap(e => e.items)
          .filter(
            item =>
              (!item.togglable ||
                userData?.enabledModules.includes(_.kebabCase(item.name))) &&
              !item.forceDisable
          )
          .flatMap(item => {
            if (item.provider) {
              const Provider: React.FC = item.provider

              return {
                path: '/' + _.kebabCase(item.name),
                element: <Provider />,
                children: ChildRoutesRenderer({
                  routes: item.routes,
                  APIKeys: item.requiredAPIKeys,
                  isNested: true,
                  loadingMessage: t('loadingModule')
                })
              } as RouteObject
            } else {
              return ChildRoutesRenderer({
                routes: item.routes,
                APIKeys: item.requiredAPIKeys,
                loadingMessage: t('loadingModule')
              })
            }
          })
          .concat([
            {
              path: '/auth/*',
              element: <NavigateToDashBoardWithRedirect />
            },

            {
              path: '/',
              element: <Navigate replace to="/dashboard" />
            },
            {
              path: '*',
              element: <NotFoundScreen />
            }
          ])
      }
    ])
  }, [userData, auth, t])

  return <RouterProvider router={router} />
}

export default AppRoutesProvider
