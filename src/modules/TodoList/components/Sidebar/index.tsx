/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import TaskListList from './components/TaskListList'
import TaskStatusList from './components/TaskStatusList'
import TaskTagList from './components/TaskTagList'

function Sidebar({
  isOpen,
  setOpen
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
}): React.ReactElement {
  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <SidebarTitle name="tasks" />
      <TaskStatusList setSidebarOpen={setOpen} />
      <SidebarDivider />
      <TaskListList setSidebarOpen={setOpen} />
      <SidebarDivider />
      <TaskTagList setSidebarOpen={setOpen} />
    </SidebarWrapper>
  )
}

export default Sidebar
