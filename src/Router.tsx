import React, { Suspense, useMemo, useCallback } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@providers/AuthProvider'
import Auth from './auth'
import { COMPONENTS } from './Components'
import Loading from './components/Screens/Loading'
import NotFound from './components/Screens/NotFound'
import { ROUTES } from './constants/routes_config'
import MainApplication from './MainApplication'
import { titleToPath, convertToDashCase } from './utils/strings'

function AppRouter(): React.ReactElement {
  const { auth, authLoading, userData } = useAuthContext()
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
      isNested: boolean = false
    ): React.ReactElement[] => {
      return Object.entries(routes).map(([route, path], index) => {
        const Comp = COMPONENTS[name as keyof typeof COMPONENTS][
          route as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]
        ] as React.FC

        return (
          <Route
            key={`${name}-${index}`}
            path={(!isNested ? '/' : '') + path}
            element={Comp !== undefined ? <Comp /> : <></>}
          />
        )
      })
    },
    []
  )

  if (authLoading) return <Loading customMessage="Loading user data" />

  return (
    <Suspense fallback={<Loading customMessage="Loading module" />}>
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
                            true
                          )}
                        </Route>
                      )
                    })()
                  : renderRoutes(item.routes, convertToDashCase(item.name))
              )
          ) : (
            <Route path="*" element={<NotFound />} />
          )}
        </Route>
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
