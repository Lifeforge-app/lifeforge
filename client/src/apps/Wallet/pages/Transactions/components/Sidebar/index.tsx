import { SidebarDivider, SidebarWrapper } from 'lifeforge-ui'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import AllTransactionsButton from './components/AllTransactionsButton'
import AssetsSection from './components/AssetsSection'
import CategoriesSection from './components/CategoriesSection'
import DateRangeSelector from './components/DateRangeSelector'
import LedgerSection from './components/LedgerSection'
import MiniCalendar from './components/MiniCalendar'
import TypeSection from './components/TypeSection'

function Sidebar() {
  const { selectedType } = useWalletStore()

  return (
    <SidebarWrapper>
      <AllTransactionsButton />
      <SidebarDivider />
      <MiniCalendar />
      <SidebarDivider />
      <DateRangeSelector />
      <SidebarDivider />
      <TypeSection />
      <SidebarDivider />
      <CategoriesSection />
      {selectedType !== 'transfer' && <SidebarDivider />}
      <AssetsSection />
      <SidebarDivider />
      <LedgerSection />
    </SidebarWrapper>
  )
}

export default Sidebar
