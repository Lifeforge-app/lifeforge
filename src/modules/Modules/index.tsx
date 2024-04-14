/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { cookieParse } from 'pocketbase'
import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import Loading from '@components/Loading'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import { AuthContext } from '@providers/AuthProvider'
import { titleToPath } from '@sidebar/components/SidebarItem'
import { type ModuleEntry } from '@typedec/Module'
import ModuleItem from './ModuleItem'

const MODULES: ModuleEntry[] = [
  {
    name: 'Projects (M)',
    icon: 'tabler:clipboard',
    config: {
      githubAPIKey: {
        icon: 'tabler:brand-github',
        name: 'GitHub API Key',
        placeholder: '••••••••••••••••',
        isPassword: true
      }
    }
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
    icon: 'tabler:books'
  },
  {
    name: 'Wallet',
    icon: 'tabler:currency-dollar'
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
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
        <ul className="mb-12 mt-6 flex flex-col gap-4">
          {MODULES.map((module, index) => (
            <ModuleItem
              key={index}
              module={module}
              enabled={userData.enabledModules.includes(
                titleToPath(module.name)
              )}
              toggleModule={toggleModule}
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
