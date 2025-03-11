import React from 'react'

import { SidebarWrapper } from '@lifeforge/ui'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      hmm
    </SidebarWrapper>
  )
}

export default Sidebar
