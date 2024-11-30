import React from 'react'
import { Outlet } from 'react-router'
import Header from './components/Header'

function MainApplication(): React.ReactElement {
  return (
    <main className="relative flex size-full min-h-0 min-w-0 flex-col pb-0 sm:ml-[5.4rem] lg:ml-0">
      <Header />
      <Outlet />
    </main>
  )
}

export default MainApplication
