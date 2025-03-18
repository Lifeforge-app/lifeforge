import { SidebarDivider, SidebarTitle, SidebarWrapper } from '@lifeforge/ui'

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
}) {
  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <SidebarTitle name="tasks" namespace="apps.todoList" />
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
