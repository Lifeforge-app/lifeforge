/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import LoadingScreen from '@components/Screens/LoadingScreen'
import _ROUTES from '@constants/routes_config.json'
// import { type IModuleEntry } from '@interfaces/module_interfaces'
import { type IRoutes } from '@interfaces/routes_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'
import { titleToPath } from '@utils/strings'
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
//   { name: 'Repositories', icon: 'tabler:git-branch' },
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
  const { userData, setUserData } = useAuthContext()

  async function toggleModule(moduleName: string): Promise<void> {
    if (userData.enabledModules.includes(titleToPath(moduleName))) {
      userData.enabledModules = userData.enabledModules.filter(
        (module: string) => module !== titleToPath(moduleName)
      )
    } else {
      userData.enabledModules.push(titleToPath(moduleName))
    }
    setUserData({
      ...userData,
      enabledModules: userData.enabledModules
    })

    await APIRequest({
      endpoint: 'user/module',
      method: 'PATCH',
      body: {
        id: userData.id,
        data: userData.enabledModules
      },
      failureInfo: 'update'
    })
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
                  <h2 className="mb-6 border-l-4 border-custom-500 pl-4 text-3xl font-semibold">
                    {route.title}
                  </h2>
                  <ul className="space-y-4">
                    {route.items
                      .filter(route => route.togglable)
                      .map((route, index) => (
                        <ModuleItem
                          key={index}
                          module={route}
                          enabled={userData.enabledModules.includes(
                            titleToPath(route.name)
                          )}
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
