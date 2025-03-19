import { useAuth } from '@providers/AuthProvider'
import _ from 'lodash'
import { Route, Routes } from 'react-router'

import { NotFoundScreen } from '@lifeforge/ui'

import ROUTES from '../../Routes'
import Auth from '../../pages/Auth'
import ChildRoutesRenderer from './ChildRoutesRenderer'
import MainApplication from './Layout'

function MainRoutesRenderer() {
  const { userData } = useAuth()

  return (
    <Routes>
      <Route element={<MainApplication />} path="/">
        {userData !== null ? (
          ROUTES.flatMap(e => e.items)
            .filter(
              item =>
                !item.togglable ||
                userData.enabledModules.includes(_.kebabCase(item.name))
            )
            .map(item =>
              item.provider !== undefined
                ? (() => {
                    const Provider: React.FC = item.provider

                    return (
                      <Route
                        key={item.name}
                        element={<Provider />}
                        path={'/' + _.kebabCase(item.name)}
                      >
                        {ChildRoutesRenderer({
                          routes: item.routes,
                          APIKeys: item.requiredAPIKeys,
                          isNested: true
                        })}
                      </Route>
                    )
                  })()
                : ChildRoutesRenderer({
                    routes: item.routes,
                    APIKeys: item.requiredAPIKeys
                  })
            )
        ) : (
          <Route element={<NotFoundScreen />} path="*" />
        )}
      </Route>
      <Route element={<Auth />} path="auth" />
      <Route element={<NotFoundScreen />} path="*" />
    </Routes>
  )
}

export default MainRoutesRenderer
