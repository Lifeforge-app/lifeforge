/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'

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
