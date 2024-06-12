/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import TaskListList from './components/TaskListList'
import TaskStatusList from './components/TaskStatusList'
import TaskTagList from './components/TaskTagList'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  return (
    <>
      <aside
        className={`absolute ${
          sidebarOpen ? 'left-0' : 'left-full'
        } top-0 z-[9999] size-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
          <SidebarTitle name="tasks" />
          <TaskStatusList setSidebarOpen={setSidebarOpen} />
          <SidebarDivider />
          <TaskListList setSidebarOpen={setSidebarOpen} />
          <SidebarDivider />
          <TaskTagList setSidebarOpen={setSidebarOpen} />
        </ul>
      </aside>
    </>
  )
}

export default Sidebar
