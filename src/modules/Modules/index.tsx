import { useAuth } from '@providers/AuthProvider'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { LoadingScreen, ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IRoutes } from '../../core/interfaces/routes_interfaces'
import _ROUTES from '../../core/routes_config.json'
// import { type IModuleEntry } from '@interfaces/module_interfaces'
import ModuleItem from './ModuleItem'

const ROUTES = _ROUTES as IRoutes[]

// const MODULES: IModuleEntry[] = [
//   {
//     name: 'Projects (M)',
//     icon: 'tabler:clipboard',
//     config: {
//       githubAPIKey: {
//         type: 'input',
//         icon: 'tabler:brand-github',
//         name: 'GitHub API Key',
//         placeholder: '••••••••••••••••',
//         isPassword: true
//       }
//     }
//   },
//   {
//     name: 'Projects (K)',
//     icon: 'tabler:clipboard'
//   },
//   { name: 'Idea Box', icon: 'tabler:bulb' },
//   { name: 'Todo List', icon: 'tabler:list-check' },
//   { name: 'Calendar', icon: 'tabler:calendar' },
//   { name: 'Spotify', icon: 'tabler:brand-spotify' },
//   { name: 'Code Time', icon: 'tabler:code' },
//   { name: 'Photos', icon: 'tabler:camera' },
//   { name: 'Music', icon: 'tabler:music' },
//   { name: 'Guitar Tabs', icon: 'mingcute:guitar-line' },
//   { name: 'Pomodoro Timer', icon: 'tabler:clock-bolt' },
//   { name: 'Flashcards', icon: 'tabler:cards' },
//   {
//     name: 'Notes',
//     icon: 'tabler:notebook'
//   },
//   {
//     name: 'Books Library',
//     icon: 'tabler:books'
//   },
//   { name: 'Journal', icon: 'tabler:book' },
//   { name: 'Achievements', icon: 'tabler:award' },
//   {
//     name: 'Wallet',
//     icon: 'tabler:currency-dollar'
//   },
//   {
//     name: 'Budgets',
//     icon: 'tabler:coin'
//   },
//   { name: 'Wish List', icon: 'tabler:heart' },
//   { name: 'Contacts', icon: 'tabler:users' },
//   { name: 'Passwords', icon: 'tabler:key' },
//   {
//     name: 'Flight Status',
//     icon: 'tabler:plane'
//   },
//   {
//     name: 'Airline Information',
//     icon: 'tabler:line'
//   },
//   {
//     name: 'Mail Inbox',
//     icon: 'tabler:inbox'
//   },
//   {
//     name: 'DNS Records',
//     icon: 'tabler:cloud'
//   },
//   {
//     name: 'Blog Posts',
//     icon: 'tabler:file-text'
//   }
// ]

function Modules(): React.ReactElement {
  const { t } = useTranslation('common.sidebar')
  const { userData, setUserData } = useAuth()

  async function toggleModule(moduleName: string): Promise<void> {
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
