import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const { sidebarOpen, setSidebarOpen } = useProjectsMContext().miscellaneous
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9990] size-full rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
    >
      <Scrollbar>
        <div className="flex-between flex px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col">
          <SidebarItem icon="tabler:list" name="All Projects" />
          <SidebarItem icon="tabler:star-filled" name="Starred" />
          {(
            ['categories', 'statuses', 'visibilities', 'technologies'] as const
          ).map(stuff => (
            <>
              <SidebarDivider />
              <SidebarSection stuff={stuff} />
            </>
          ))}
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default Sidebar
