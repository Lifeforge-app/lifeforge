import MainApplication from '@core/routes/components/Layout'
import { NotFoundScreen } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router'

import Auth from '../../pages/Auth'
import { useAuth } from '../../providers/AuthProvider'
import ROUTES from '../Routes'
import ChildRoutesRenderer from './ChildRoutesRenderer'

function MainRoutesRenderer() {
  const { t } = useTranslation('common.misc')

  const { userData } = useAuth()

  return (
    <Routes>
      <Route element={<MainApplication />} path="/">
        {userData !== null ? (
          ROUTES.flatMap(e => e.items)
            .filter(
              item =>
                (!item.togglable ||
                  userData.enabledModules.includes(_.kebabCase(item.name))) &&
                !item.forceDisable
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
                          isNested: true,
                          t
                        })}
                      </Route>
                    )
                  })()
                : ChildRoutesRenderer({
                    routes: item.routes,
                    APIKeys: item.requiredAPIKeys,
                    t
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
