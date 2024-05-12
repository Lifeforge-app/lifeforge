/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import GoBackButton from '@components/GoBackButton'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
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
        } top-0 z-[10] h-full w-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-3rem)] lg:w-4/12 xl:w-1/4`}
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
