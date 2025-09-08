import { SidebarDivider, SidebarTitle, SidebarWrapper } from 'lifeforge-ui'

import TaskListList from './components/TaskListList'
import TaskPriorityList from './components/TaskPriorityList'
import TaskStatusList from './components/TaskStatusList'
import TaskTagList from './components/TaskTagList'

function Sidebar() {
  return (
    <SidebarWrapper>
      <SidebarTitle label="tasks" namespace="apps.todoList" />
      <TaskStatusList />
      <SidebarDivider />
      <TaskPriorityList />
      <SidebarDivider />
      <TaskListList />
      <SidebarDivider />
      <TaskTagList />
    </SidebarWrapper>
  )
}

export default Sidebar
