/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import Loading from '@components/Screens/Loading'
import { ROUTES } from '@constants/routes_config'
// import { type IModuleEntry } from '@interfaces/module_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'
import { titleToPath } from '@utils/strings'
import ModuleItem from './ModuleItem'

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
      failureInfo: 'Failed to update personalization settings.'
    })
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Modules"
        desc="A place to toggle which modules you want to use."
      />
      {userData ? (
        <ul className="mb-12 mt-6 space-y-4">
          {ROUTES.flatMap(route => route.items)
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
      ) : (
        <Loading />
      )}
    </ModuleWrapper>
  )
}

export default Modules
