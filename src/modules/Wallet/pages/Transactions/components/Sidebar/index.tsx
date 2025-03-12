import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { SidebarDivider, SidebarItem, SidebarWrapper } from '@lifeforge/ui'

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
}) {
  const { t } = useTranslation('modules.wallet')
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        active={searchParams.entries().next().done === true}
        icon="tabler:list"
        name={t('sidebar.allTransactions')}
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
      {searchParams.get('type') !== 'transfer' && <SidebarDivider />}
      <AssetsSection setSidebarOpen={setSidebarOpen} />
      <SidebarDivider />
      <LedgerSection setSidebarOpen={setSidebarOpen} />
    </SidebarWrapper>
  )
}

export default Sidebar
