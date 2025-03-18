import { useAuth } from '@providers/AuthProvider'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingScreen, ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import ROUTES from '../../core/routes/Routes'
import ModuleItem from './ModuleItem'

function Modules() {
  const { t } = useTranslation('common.sidebar')
  const { userData, setUserData } = useAuth()

  async function toggleModule(moduleName: string) {
    const newEnabledModules = userData.enabledModules.includes(
      _.kebabCase(moduleName)
    )
      ? userData.enabledModules.filter(
          (module: string) => module !== _.kebabCase(moduleName)
        )
      : [...userData.enabledModules, _.kebabCase(moduleName)]

    setUserData({
      ...userData,
      enabledModules: newEnabledModules
    })

    try {
      await fetchAPI('user/module', {
        method: 'PATCH',
        body: {
          data: newEnabledModules
        }
      })
    } catch {
      toast.error('Failed to update modules')
      setUserData({
        ...userData,
        enabledModules: userData.enabledModules
      })
    }
  }

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:plug" title="Modules" />
      {userData ? (
        <ul className="my-8 space-y-12">
          {ROUTES.map(
            route =>
              route.items.filter(route => route.togglable).length > 0 && (
                <li key={route.title}>
                  <h2 className="before:bg-custom-500 relative mb-6 pl-4 text-3xl font-semibold before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-full">
                    {t(`categories.${_.camelCase(route.title)}`)}
                  </h2>
                  <ul className="space-y-2">
                    {route.items
                      .filter(route => route.togglable)
                      .map((route, index) => (
                        <ModuleItem
                          key={index}
                          enabled={userData.enabledModules.includes(
                            _.kebabCase(route.name)
                          )}
                          module={route}
                          toggleModule={() => {
                            toggleModule(route.name).catch(console.error)
                          }}
                        />
                      ))}
                  </ul>
                </li>
              )
          )}
        </ul>
      ) : (
        <LoadingScreen />
      )}
    </ModuleWrapper>
  )
}

export default Modules
