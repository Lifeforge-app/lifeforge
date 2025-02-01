import React from 'react'
import {
  SidebarDivider,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import TaskListList from './components/TaskListList'
import TaskPriorityList from './components/TaskPriorityList'
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
      <SidebarTitle name="tasks" namespace="modules.todoList" />
      <TaskStatusList setSidebarOpen={setOpen} />
      <SidebarDivider />
      <TaskPriorityList setSidebarOpen={setOpen} />
      <SidebarDivider />
      <TaskListList setSidebarOpen={setOpen} />
      <SidebarDivider />
      <TaskTagList setSidebarOpen={setOpen} />
    </SidebarWrapper>
  )
}

export default Sidebar
