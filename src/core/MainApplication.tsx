import React from 'react'
import { Outlet } from 'react-router'

import Sidebar from './components/sidebar/Sidebar'

function MainApplication(): React.ReactElement {
  return (
    <>
      <Sidebar />
      <main className="relative flex size-full min-h-0 min-w-0 flex-col overflow-x-hidden pb-0 sm:ml-[5.4rem] lg:ml-0">
        <Outlet />
      </main>
    </>
  )
}

export default MainApplication
