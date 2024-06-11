import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type IWalletLedgerEntry,
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import ManageCategoriesModal from './components/ManageCategoriesModal'
import ModifyTransactionsModal from './components/ModifyTransactionsModal'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ListView from './views/ListView'
import TableView from './views/TableView'
import ColumnVisibilityToggle from './views/TableView/ColumnVisibilityToggle'

function Transactions(): React.ReactElement {
  const [transactions, refreshTransactions] = useFetch<
    IWalletTransactionEntry[]
  >('wallet/transactions/list')
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [ledgers] = useFetch<IWalletLedgerEntry[]>('wallet/ledgers/list')
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )
  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [visibleColumn, setVisibleColumn] = useState([
    'Date',
    'Type',
    'Ledger',
    'Asset',
    'Particular',
    'Category',
    'Amount',
    'Receipt'
  ])
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const [isManageCategoriesModalOpen, setManageCategoriesModalOpen] =
    useState(false)
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'list' | 'table'>('table')
  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      navigate('/wallet/transactions')
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Transactions"
        desc="Manage your Transactions here."
        actionButton={
          typeof transactions !== 'string' &&
          transactions.length > 0 && (
            <Button
              className="hidden md:flex"
              onClick={() => {
                setModifyModalOpenType('create')
              }}
              icon="tabler:plus"
            >
              Add Transaction
            </Button>
          )
        }
        hasHamburgerMenu
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:apps"
              text="Manage Categories"
              onClick={() => {
                setManageCategoriesModalOpen(true)
              }}
            />
            {view === 'table' && (
              <ColumnVisibilityToggle
                visibleColumn={visibleColumn}
                setVisibleColumn={setVisibleColumn}
              />
            )}
          </>
        }
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          assets={assets}
          categories={categories}
          transactions={transactions}
          ledgers={ledgers}
        />
        <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col lg:ml-8">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setView={setView}
            view={view}
          />
          <div className="mt-8 size-full overflow-y-auto">
            <APIComponentWithFallback
              data={
                [transactions, categories, assets, ledgers].find(e =>
                  ['loading', 'error'].includes(e as string)
                ) ?? transactions
              }
            >
              {typeof transactions !== 'string' &&
              typeof categories !== 'string' &&
              typeof assets !== 'string' &&
              typeof ledgers !== 'string' &&
              transactions.length > 0 ? (
                view === 'list' ? (
                  <TableView
                    transactions={transactions}
                    categories={categories}
                    assets={assets}
                    ledgers={ledgers}
                    visibleColumn={visibleColumn}
                    setDeleteTransactionsConfirmationOpen={
                      setDeleteTransactionsConfirmationOpen
                    }
                    setModifyModalOpenType={setModifyModalOpenType}
                    setSelectedData={setSelectedData}
                  />
                ) : (
                  <ListView
                    transactions={transactions}
                    categories={categories}
                    setDeleteTransactionsConfirmationOpen={
                      setDeleteTransactionsConfirmationOpen
                    }
                    setModifyModalOpenType={setModifyModalOpenType}
                    setSelectedData={setSelectedData}
                  />
                )
              ) : (
                <EmptyStateScreen
                  title="Oops! No Transaction found."
                  description="You don't have any Transactions yet. Add some to get started."
                  ctaContent="Add Transaction"
                  setModifyModalOpenType={setModifyModalOpenType}
                  icon="tabler:wallet-off"
                />
              )}
            </APIComponentWithFallback>
            {transactions.length > 0 && (
              <FAB
                onClick={() => {
                  setSelectedData(null)
                  setModifyModalOpenType('create')
                }}
                hideWhen="md"
              />
            )}
          </div>
        </div>
      </div>
      <ModifyTransactionsModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyTransactionsModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshTransactions={refreshTransactions}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/Transactions/delete"
        isOpen={deleteTransactionsConfirmationOpen}
        data={selectedData}
        itemName="transaction"
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={refreshTransactions}
      />
      <ManageCategoriesModal
        isOpen={isManageCategoriesModalOpen}
        onClose={() => {
          setManageCategoriesModalOpen(false)
          refreshTransactions()
          refreshCategories()
        }}
      />
    </ModuleWrapper>
  )
}

export default Transactions
