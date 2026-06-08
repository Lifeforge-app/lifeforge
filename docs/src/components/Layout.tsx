import { useState } from 'react'
import { Outlet } from 'react-router'

import { Flex, Text } from '@lifeforge/ui'

import Boilerplate from './Boilerplate'
import Header from './Header'
import Rightbar from './Rightbar'
import Sidebar from './Sidebar'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Text
      asChild
      color={{
        base: 'bg-800',
        dark: 'bg-100'
      }}
    >
      <Flex
        bg={{
          base: 'bg-100',
          dark: 'bg-900'
        }}
        direction="column"
        height="100dvh"
        id="app"
        minHeight="0"
        width="100%"
      >
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <Flex flex="1" height="100%" minHeight="0">
          <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
          <Boilerplate>
            <Outlet />
          </Boilerplate>
          <Rightbar />
        </Flex>
      </Flex>
    </Text>
  )
}

export default Layout
