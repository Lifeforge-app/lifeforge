import { useState } from 'react'
import { Outlet } from 'react-router'

import Boilerplate from './Boilerplate'
import Header from './Header'
import Rightbar from './Rightbar'
import Sidebar from './Sidebar'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main
      className="bg-bg-100 dark:bg-bg-900 text-bg-800 dark:text-bg-100 flex h-dvh w-full flex-col text-base transition-colors"
      id="app"
    >
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <Boilerplate>
          <Outlet />
        </Boilerplate>
        <Rightbar />
      </div>
    </main>
  )
}

export default Layout
