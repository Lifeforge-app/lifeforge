import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import FAB from '@components/ButtonsAndInputs/FAB'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import ManageCategoriesModal from './components/ManageCategoriesModal'
import ModifyTransactionsModal from './components/ModifyTransactionsModal'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import TransactionsHeader from './components/TransactionsHeader'
import ListView from './views/ListView'
import TableView from './views/TableView'
import ColumnVisibilityToggle from './views/TableView/components/ColumnVisibilityToggle'

function Transactions(): React.ReactElement {
  const {
    transactions,
    refreshTransactions,
    ledgers,
    assets,
    refreshAssets,
    categories,
    refreshCategories,
    filteredTransactions
  } = useWalletContext()

  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [visibleColumn, setVisibleColumn] = useState([
    'Date',
    'Type',
    'Ledger',
    'Asset',
    'Particulars',
    'Category',
    'Amount',
    'Receipt'
  ])
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const [isManageCategoriesModalOpen, setManageCategoriesModalOpen] = useState<
    boolean | 'new'
  >(false)
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'list' | 'table'>('list')

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
          setManageCategoriesModalOpen={setManageCategoriesModalOpen}
        />
        <div className="flex h-full min-w-0 flex-1 flex-col lg:ml-8">
          <TransactionsHeader
            setModifyModalOpenType={setModifyModalOpenType}
            setSidebarOpen={setSidebarOpen}
          />
          <SearchBar setView={setView} view={view} />
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
                filteredTransactions.length > 0 ? (
                  view === 'table' ? (
                    <TableView
                      visibleColumn={visibleColumn}
                      setDeleteTransactionsConfirmationOpen={
                        setDeleteTransactionsConfirmationOpen
                      }
                      setModifyModalOpenType={setModifyModalOpenType}
                      setSelectedData={setSelectedData}
                    />
                  ) : (
                    <ListView
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
                    description="No transactions found with the selected filters."
                    icon="tabler:filter-off"
                  />
                )
              ) : (
                <EmptyStateScreen
                  title="Oops! No Transaction found."
                  description="You don't have any transactions yet. Add some to get started."
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
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/Transactions"
        isOpen={deleteTransactionsConfirmationOpen}
        data={selectedData}
        itemName="transaction"
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={() => {
          refreshTransactions()
          refreshAssets()
        }}
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
