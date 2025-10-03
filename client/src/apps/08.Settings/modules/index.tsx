import ROUTES from '@core/routes'
import forgeAPI from '@utils/forgeAPI'
import { LoadingScreen, ModuleHeader } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'shared'

import ModuleItem from './components/ModuleItem'

function Modules() {
  const { t } = useTranslation('common.sidebar')

  const { userData, setUserData } = useAuth()

  async function toggleModule(moduleName: string) {
    if (!userData) return

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
      await forgeAPI.modules.toggle
        .input({
          id: _.kebabCase(moduleName)
        })
        .mutate({})
    } catch {
      toast.error('Failed to update modules')
      setUserData({
        ...userData,
        enabledModules: userData.enabledModules
      })
    }
  }

  return (
    <>
      <ModuleHeader />
      {userData ? (
        <ul className="mb-8 space-y-12">
          {ROUTES.map(
            route =>
              route.items.filter(route => route.togglable).length > 0 && (
                <li key={route.title}>
                  <h2 className="before:bg-custom-500 relative mb-6 pl-4 text-3xl font-semibold before:absolute before:top-1/2 before:left-0 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-full">
                    {t(`categories.${_.camelCase(route.title)}`)}
                  </h2>
                  <ul className="space-y-3">
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
    </>
  )
}

export default Modules
