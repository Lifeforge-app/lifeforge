import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import AssetsSection from './components/AssetsSection'
import CategoriesSection from './components/CategoriesSection'
import LedgerSection from './components/LedgerSection'
import TypeSection from './components/TypeSection'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  setManageCategoriesModalOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  setManageCategoriesModalOpen: React.Dispatch<
    React.SetStateAction<boolean | 'new'>
  >
}): React.ReactElement {
  const navigate = useNavigate()
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9999] size-full bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
    >
      <Scrollbar>
        <div className="flex flex-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col">
          <SidebarItem
            icon="tabler:list"
            name="All Transactions"
            active={location.search === ''}
            onClick={() => {
              navigate('/wallet/transactions')
            }}
          />
          <SidebarDivider />
          <TypeSection setSidebarOpen={setSidebarOpen} />
          <SidebarDivider />
          <CategoriesSection
            setManageCategoriesModalOpen={setManageCategoriesModalOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <SidebarDivider />
          <AssetsSection setSidebarOpen={setSidebarOpen} />
          <SidebarDivider />
          <LedgerSection setSidebarOpen={setSidebarOpen} />
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default Sidebar
