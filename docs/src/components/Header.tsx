import { Icon } from '@iconify/react'
import { Link } from 'shared'
import { usePersonalization } from 'shared'

import GithubStarCount from './GithubStarCount'

function Header({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  const { setTheme, derivedTheme } = usePersonalization()

  return (
    <header className="bg-bg-100 dark:bg-bg-900 border-bg-200 dark:border-bg-800 sticky top-0 z-[55] flex w-full items-center gap-8 border-b-[1.5px] p-3 px-5 transition-colors">
      <Link className="flex items-center gap-2" to="/">
        <Icon className="text-custom-500 h-8 w-8" icon="tabler:hammer" />
        <h1 className="hidden text-2xl font-semibold [@media(min-width:420px)]:block">
          LifeForge
          <span className="text-custom-500 ml-1 text-2xl">.</span>
          <span className="ml-1 text-xl font-medium">Docs</span>
        </h1>
        <span className="ml-1 text-xl font-medium [@media(min-width:420px)]:hidden">
          Docs.
        </span>
      </Link>
      <div className="flex w-full items-center justify-end gap-2">
        <search className="bg-bg-50 dark:bg-bg-800/50 mr-2 hidden w-80 items-center gap-2 rounded-lg p-2 pl-4 shadow-sm md:flex lg:w-96">
          <div className="flex w-full items-center gap-2">
            <Icon className="text-bg-400 h-5 w-5" icon="tabler:search" />
            <input
              className="placeholder-bg-400 w-full bg-transparent p-1 focus:outline-none"
              placeholder="Search documentation..."
              type="text"
            />
          </div>
          <div className="text-bg-400 bg-bg-200/50 dark:bg-bg-800/90 flex items-center rounded-md p-1 px-1.5 shadow-sm">
            <Icon className="h-4 w-4" icon="tabler:command" />
            <span className="text-bg-400 ml-0.5 text-sm">K</span>
          </div>
        </search>
        <button
          className="text-bg-400 hover:text-bg-800 dark:hover:text-bg-100 p-2"
          onClick={() => {
            localStorage.setItem(
              'theme',
              derivedTheme === 'dark' ? 'light' : 'dark'
            )
            setTheme(derivedTheme === 'dark' ? 'light' : 'dark')
          }}
        >
          <Icon
            className="h-6 w-6 transition-all"
            icon={derivedTheme === 'dark' ? 'uil:moon' : 'uil:sun'}
          />
        </button>
        <GithubStarCount />
        <button
          className="block p-2 xl:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Icon className="text-bg-400 h-6 w-6" icon="tabler:menu" />
        </button>
      </div>
    </header>
  )
}

export default Header
