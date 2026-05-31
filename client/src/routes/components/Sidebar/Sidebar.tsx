import { useState } from 'react'

import { useMainSidebarState } from '@lifeforge/shared'
import { Flex, SidebarItem, Transition } from '@lifeforge/ui'

import SidebarBottomBar from './SidebarBottomBar'
import SidebarEventBanner from './SidebarEventBanner'
import SidebarHeader from './SidebarHeader'
import SidebarItems from './SidebarItems'

function Sidebar() {
  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Transition duration="300ms">
      <Flex
        shadow
        as="aside"
        bg={{ base: 'bg-50', dark: 'bg-900' }}
        direction="column"
        flexShrink="0"
        height="100dvh"
        left="0"
        minWidth={sidebarExpanded ? '20em' : '0'}
        overflow="hidden"
        position={{
          base: 'absolute',
          lg: 'relative'
        }}
        rbr="2xl"
        rtr="2xl"
        top="0"
        width={
          sidebarExpanded
            ? {
                base: '100%',
                sm: '50%',
                lg: '25%',
                xl: '20%'
              }
            : {
                base: '0',
                sm: '5.4em'
              }
        }
        zIndex="99"
      >
        <SidebarEventBanner />
        <SidebarHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <SidebarItems query={searchQuery} />
        {!sidebarExpanded && (
          <SidebarItem
            active={false}
            icon="tabler:layout-sidebar-left-expand"
            label=""
            onClick={toggleSidebar}
          />
        )}
        <SidebarBottomBar />
      </Flex>
    </Transition>
  )
}

export default Sidebar
