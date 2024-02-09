/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { useContext, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Switch } from '@headlessui/react'
import { AuthContext } from '../../providers/AuthProvider'
import Loading from '../../components/general/Loading'
import { titleToPath } from '../../components/Sidebar/components/SidebarItem'
import { toast } from 'react-toastify'

const MODULES = [
  {
    name: 'Projects (M)',
    icon: 'tabler:clipboard'
  },
  {
    name: 'Projects (K)',
    icon: 'tabler:clipboard'
  },
  { name: 'Idea Box', icon: 'tabler:bulb' },
  { name: 'Todo List', icon: 'tabler:list-check' },
  { name: 'Calendar', icon: 'tabler:calendar' },
  { name: 'Spotify', icon: 'tabler:brand-spotify' },
  { name: 'Code Time', icon: 'tabler:code' },
  { name: 'Photos', icon: 'tabler:camera' },
  { name: 'Pomodoro Timer', icon: 'tabler:clock-bolt' },
  { name: 'Flashcards', icon: 'tabler:cards' },
  {
    name: 'Notes',
    icon: 'tabler:notebook'
  },
  {
    name: 'Reference Books',
    icon: 'tabler:books',
    subsection: [
      ['Mathematics', 'tabler:calculator'],
      ['Physics', 'tabler:atom']
    ]
  },
  {
    name: 'Wallet',
    icon: 'tabler:currency-dollar',
    subsection: [
      ['Balance', 'tabler:wallet'],
      ['Transactions', 'tabler:arrows-exchange'],
      ['Budgets', 'tabler:coin'],
      ['Reports', 'tabler:chart-bar']
    ]
  },
  { name: 'Wish List', icon: 'tabler:heart' },
  { name: 'Contacts', icon: 'tabler:users' },
  { name: 'Passwords', icon: 'tabler:key' }
]

function Modules(): React.ReactElement {
  const { userData, setUserData } = useContext(AuthContext)

  function toggleModule(moduleName: string): void {
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

    fetch(`${import.meta.env.VITE_API_HOST}/user/module`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userData.id,
        data: userData.enabledModules
      })
    })
      .then(async response => {
        const data = await response.json()
        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        toast.error('Failed to update personalization settings.')
      })
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Modules"
        desc="A place to toggle which modules you want to use."
      />
      {userData ? (
        <ul className="mb-12 mt-8 flex flex-col gap-4">
          {MODULES.map((module, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-4 dark:bg-bg-900"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-custom-500/20 p-3 dark:bg-bg-800">
                  <Icon icon={module.icon} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold dark:text-bg-100">
                  {module.name}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={userData.enabledModules.includes(
                    titleToPath(module.name)
                  )}
                  onChange={() => {
                    toggleModule(module.name)
                  }}
                  className={`${
                    userData.enabledModules.includes(titleToPath(module.name))
                      ? 'bg-custom-500'
                      : 'bg-bg-800'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`${
                      userData.enabledModules.includes(titleToPath(module.name))
                        ? 'translate-x-6 bg-bg-100'
                        : 'translate-x-1 bg-bg-500'
                    } inline-block h-4 w-4 rounded-full transition`}
                  />
                </Switch>
                <button className="rounded-lg p-2 text-bg-500 hover:bg-bg-800/50">
                  <Icon icon="tabler:chevron-right" className="text-xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Loading />
      )}
    </ModuleWrapper>
  )
}

export default Modules
