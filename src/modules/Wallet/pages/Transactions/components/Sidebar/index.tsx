import React from 'react'
import { useNavigate } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import {
  type IWalletCategoryEntry,
  type IWalletTransactionEntry,
  type IWalletAssetEntry,
  type IWalletLedgerEntry
} from '@interfaces/wallet_interfaces'
import AssetsSection from './components/AssetsSection'
import CategoriesSection from './components/CategoriesSection'
import LedgerSection from './components/LedgerSection'
import TypeSection from './components/TypeSection'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  categories,
  transactions,
  assets,
  ledgers,
  setManageCategoriesModalOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: IWalletCategoryEntry[] | 'loading' | 'error'
  transactions: IWalletTransactionEntry[] | 'loading' | 'error'
  assets: IWalletAssetEntry[] | 'loading' | 'error'
  ledgers: IWalletLedgerEntry[] | 'loading' | 'error'
  setManageCategoriesModalOpen: React.Dispatch<
    React.SetStateAction<boolean | 'new'>
  >
}): React.ReactElement {
  const navigate = useNavigate()
  return (
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
        <SidebarItem
          icon="tabler:list"
          name="All Transactions"
          active={location.search === ''}
          onClick={() => {
            navigate('/wallet/transactions')
          }}
        />
        <SidebarDivider />
        <TypeSection
          setSidebarOpen={setSidebarOpen}
          transactions={transactions}
        />
        <SidebarDivider />
        <CategoriesSection
          categories={categories}
          transactions={transactions}
          setManageCategoriesModalOpen={setManageCategoriesModalOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <SidebarDivider />
        <AssetsSection
          assets={assets}
          transactions={transactions}
          setSidebarOpen={setSidebarOpen}
        />
        <SidebarDivider />
        <LedgerSection
          ledgers={ledgers}
          transactions={transactions}
          setSidebarOpen={setSidebarOpen}
        />
      </ul>
    </aside>
  )
}

export default Sidebar
