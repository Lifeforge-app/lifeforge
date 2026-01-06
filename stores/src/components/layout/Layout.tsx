import { Icon } from '@iconify/react'
import { Outlet } from 'react-router-dom'

import Navbar from './Navbar'

export default function Layout() {
  return (
    <main
      className="bg-bg-200/50 dark:bg-bg-900/50 text-bg-800 dark:text-bg-50 flex h-dvh w-full flex-col overflow-auto px-8 px-12 md:px-16 lg:px-32"
      id="app"
    >
      <Navbar />
      <Outlet />
      <footer className="flex flex-col items-center justify-center gap-2 pb-6">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:creative-commons" />
          <Icon className="size-6" icon="tabler:creative-commons-by" />
          <Icon className="size-6" icon="tabler:creative-commons-nc" />
          <Icon className="size-6" icon="tabler:creative-commons-sa" />
        </div>
        <p className="text-bg-500 text-center text-sm">
          A project by{' '}
          <a
            className="text-custom-500 underline"
            href="https://thecodeblog.net"
            rel="noreferrer"
            target="_blank"
          >
            Melvin Chia
          </a>{' '}
          licensed under{' '}
          <a
            className="text-custom-500 underline"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noreferrer"
            target="_blank"
          >
            CC BY-NC-SA 4.0
          </a>
          .
        </p>
      </footer>
    </main>
  )
}
