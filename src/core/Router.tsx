import React, { Suspense, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation, useNavigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import LoadingScreen from '@components/screens/LoadingScreen'
import NotFoundScreen from '@components/screens/NotFoundScreen'
import { type IRoutes } from '@interfaces/routes_interfaces'
import APIKeyStatusProvider from '@providers/APIKeyStatusProvider'
import { useAuthContext } from '@providers/AuthProvider'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { convertToDashCase, titleToPath } from '@utils/strings'
import { COMPONENTS } from './Components'
import MainApplication from './MainApplication'
import _ROUTES from './routes_config.json'
import Auth from '../auth'

const ROUTES = _ROUTES as IRoutes[]

function AppRouter(): React.ReactElement {
  const { t } = useTranslation('common.misc')
  const { auth, authLoading, userData } = useAuthContext()
  const { theme } = usePersonalizationContext()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading) {
      if (!auth && location.pathname !== '/auth') {
        navigate('/auth?redirect=' + location.pathname + location.search)
      } else if (auth) {
        if (location.pathname === '/auth') {
          const redirect = new URLSearchParams(location.search).get('redirect')
          if (redirect !== null) {
            navigate(redirect)
          } else {
            navigate('/dashboard')
          }
        } else if (location.pathname === '/') {
          navigate('/dashboard')
        }
      }
    }
  }, [auth, location, authLoading])

  const renderRoutes = useCallback(
    (
      routes: Record<string, string>,
      name: string,
      isNested: boolean = false,
      APIKeys: string[] = []
    ): React.ReactElement[] => {
      return Object.entries(routes).map(([route, path], index) => {
        const Comp = COMPONENTS[name as keyof typeof COMPONENTS][
          route as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]
        ] as React.FC

        return (
          <Route
            key={`${name}-${index}`}
            element={
              Comp !== undefined ? (
                <Suspense
                  key={`${name}-${index}`}
                  fallback={
                    <LoadingScreen
                      customMessage={t('common.misc:loadingModule')}
                    />
                  }
                >
                  <APIKeyStatusProvider APIKeys={APIKeys}>
                    <Comp />
                  </APIKeyStatusProvider>
                </Suspense>
              ) : (
                <></>
              )
            }
            path={(!isNested ? '/' : '') + path}
          />
        )
      })
    },
    []
  )

  useEffect(() => {
    const target =
      ROUTES.flatMap(e => e.items).filter(item =>
        location.pathname.slice(1).startsWith(titleToPath(item.name))
      )[0]?.name ?? ''

    document.title = `Lifeforge. ${target !== '' ? '- ' + target : ''}`
  }, [location])

  if (authLoading) return <LoadingScreen customMessage="Loading user data" />
  if (!auth && location.pathname !== '/auth') return <Auth />

  return (
    <>
      <Routes>
        <Route element={<MainApplication />} path="/">
          {userData !== null ? (
            ROUTES.flatMap(e => e.items)
              .filter(
                item =>
                  !item.togglable ||
                  userData.enabledModules.includes(titleToPath(item.name))
              )
              .map(item =>
                item.provider !== undefined
                  ? (() => {
                      const Provider: React.FC =
                        COMPONENTS[
                          convertToDashCase(
                            item.name
                          ) as keyof typeof COMPONENTS
                        ][
                          item.provider as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]
                        ]

                      return (
                        <Route
                          key={item.name}
                          element={<Provider />}
                          path={'/' + titleToPath(item.name)}
                        >
                          {renderRoutes(
                            item.routes,
                            convertToDashCase(item.name),
                            true,
                            item.requiredAPIKeys
                          )}
                        </Route>
                      )
                    })()
                  : renderRoutes(
                      item.routes,
                      convertToDashCase(item.name),
                      false,
                      item.requiredAPIKeys
                    )
              )
          ) : (
            <Route element={<NotFoundScreen />} path="*" />
          )}
        </Route>
        <Route element={<Auth />} path="auth" />
        <Route element={<NotFoundScreen />} path="*" />
      </Routes>
      <ToastContainer
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={3000}
        newestOnTop={false}
        position="bottom-center"
        rtl={false}
        theme={theme}
      />
    </>
  )
}

export default AppRouter
