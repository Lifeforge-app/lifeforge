import React from 'react'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { useWalletContext } from '@providers/WalletProvider'
import AssetsSection from './components/AssetsSection'
import CategoriesSection from './components/CategoriesSection'
import DateRangeSelector from './components/DateRangeSelector'
import LedgerSection from './components/LedgerSection'
import MiniCalendar from './components/MiniCalendar'
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
  const { searchParams, setSearchParams } = useWalletContext()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        icon="tabler:list"
        name="All Transactions"
        active={searchParams.entries().next().done === true}
        onClick={() => {
          setSearchParams(new URLSearchParams())
          setSidebarOpen(false)
        }}
      />
      <SidebarDivider />
      <MiniCalendar />
      <SidebarDivider />
      <DateRangeSelector />
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
    </SidebarWrapper>
  )
}

export default Sidebar
