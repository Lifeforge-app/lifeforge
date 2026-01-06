import { Icon } from '@iconify/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePersonalization } from 'shared'

import GithubStarCount from '../ui/GithubStarCount'

export default function Navbar() {
  const { setTheme, derivedTheme } = usePersonalization()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="dark:bg-bg-950 sticky top-0 z-[55] w-full bg-white transition-colors">
      <div className="flex-center bg-bg-200/50 dark:bg-bg-900/50 w-full gap-8 p-12">
        <div className="absolute top-10 left-0 flex items-center gap-4">
          <button className="text-bg-500 lg:hidden">
            <Icon icon="tabler:menu" className="h-5 w-5" />
          </button>
          <Link className="flex items-center gap-3" to="/">
            <Icon className="text-custom-500 size-10" icon="tabler:hammer" />
            <div>
              <h1 className="hidden text-2xl font-semibold [@media(min-width:420px)]:block">
                Forgistry
                <span className="text-custom-500 ml-1 text-2xl">.</span>
              </h1>
              <p className="text-bg-500 text-sm">
                LifeForge.'s Module Registry
              </p>
            </div>
          </Link>
        </div>
        <ul className="hidden gap-12 px-1 text-base lg:flex">
          <li>
            <Link
              to="/"
              className="text-bg-800 dark:text-bg-100 after:bg-custom-500 relative font-semibold after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link to="/registry" className="text-bg-500 font-medium">
              Discover
            </Link>
          </li>
          <li>
            <Link to="/registry" className="text-bg-500 font-medium">
              Developer
            </Link>
          </li>
        </ul>
        <div className="absolute top-8 right-0 flex gap-2">
          <search className="component-bg-with-hover mr-2 hidden w-64 items-center gap-2 rounded-full p-2 pl-4 md:flex">
            <div className="flex w-full items-center gap-2">
              <Icon className="text-bg-400 h-5 w-5" icon="tabler:search" />
              <input
                className="placeholder-bg-400 w-full bg-transparent p-1 focus:outline-none"
                placeholder="Search modules..."
                type="text"
              />
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
        </div>
      </div>
    </header>
  )
}
