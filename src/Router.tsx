import { t } from 'i18next'
import React, { Suspense, useCallback, useEffect, useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LoadingScreen from '@components/Screens/LoadingScreen'
import NotFoundScreen from '@components/Screens/NotFoundScreen'
import { type IRoutes } from '@interfaces/routes_interfaces'
import APIKeyStatusProvider from '@providers/APIKeyStatusProvider'
import { useAuthContext } from '@providers/AuthProvider'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { convertToDashCase, titleToPath } from '@utils/strings'
import Auth from './auth'
import { COMPONENTS } from './Components'
import _ROUTES from './constants/routes_config.json'
import MainApplication from './MainApplication'

const ROUTES = _ROUTES as IRoutes[]

function AppRouter(): React.ReactElement {
  const { auth, authLoading, userData } = useAuthContext()
  const { theme } = usePersonalizationContext()
  const location = useLocation()
  const navigate = useNavigate()

  const handleRedirect = useCallback(() => {
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

  useMemo(handleRedirect, [handleRedirect])

  const renderRoutes = useCallback(
    (
      routes: Record<string, string>,
      name: string,
      isNested: boolean = false,
      APIKeys: string[] = []
    ): React.ReactElement[] => {
      return Object.entries(routes).map(([route, path], index) => {
        const Comp = COMPONENTS[name as keyof typeof COMPONENTS][
          route as keyof typeof COMPONENTS[keyof typeof COMPONENTS]
        ] as React.FC

        return (
          <Route
            key={`${name}-${index}`}
            path={(!isNested ? '/' : '') + path}
            element={
              Comp !== undefined ? (
                <Suspense
                  fallback={
                    <LoadingScreen customMessage={t('modules.loadingModule')} />
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

  return (
    <>
      <Routes>
        <Route path="/" element={<MainApplication />}>
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
                      const Provider =
                        // @ts-expect-error - I don't know how to fix this ;-;
                        COMPONENTS[convertToDashCase(item.name)][item.provider]
                      return (
                        <Route
                          key={item.name}
                          path={'/' + titleToPath(item.name)}
                          element={<Provider />}
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
            <Route path="*" element={<NotFoundScreen />} />
          )}
        </Route>
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </>
  )
}

export default AppRouter
