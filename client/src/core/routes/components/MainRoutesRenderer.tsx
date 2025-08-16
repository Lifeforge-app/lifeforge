import Auth from '@core/pages/Auth'
import MainApplication from '@core/routes/components/Layout'
import { LoadingScreen, NotFoundScreen } from 'lifeforge-ui'
import _ from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  type RouteObject,
  RouterProvider,
  createBrowserRouter
} from 'react-router'

import { useAuth } from '../../providers/AuthProvider'
import ROUTES from '../Routes'
import ChildRoutesRenderer from './ChildRoutesRenderer'

function MainRoutesRenderer() {
  const { t } = useTranslation('common.misc')

  const { userData, authLoading, auth } = useAuth()

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
        element: <MainApplication />,
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
              element: <Navigate replace to="/dashboard" />
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
  }, [userData, auth])

  if (authLoading) {
    return <LoadingScreen customMessage={t('loadingUserData')} />
  }

  return <RouterProvider router={router} />
}

export default MainRoutesRenderer
