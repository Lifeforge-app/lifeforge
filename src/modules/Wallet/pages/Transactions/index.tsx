import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import FAB from '@components/ButtonsAndInputs/FAB'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { useWalletContext } from '@providers/WalletProvider'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import TransactionsHeader from './components/TransactionsHeader'
import ManageCategoriesModal from './modals/ManageCategoriesModal'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ListView from './views/ListView'
import ReceiptModal from './views/ListView/components/ReceiptModal'
import TableView from './views/TableView'
import ColumnVisibilityToggle from './views/TableView/components/ColumnVisibilityToggle'

function Transactions(): React.ReactElement {
  const {
    transactions,
    refreshTransactions,
    refreshAssets,
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
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const [isManageCategoriesModalOpen, setManageCategoriesModalOpen] = useState<
    boolean | 'new'
  >(false)
  const [selectedData, setSelectedData] = useState<IWalletTransaction | null>(
    null
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'list' | 'table'>('list')
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [receiptToView, setReceiptToView] = useState('')

  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      return
    }

    if (sidebarOpen) {
      setSubSidebarExpanded(true)
    } else {
      setSubSidebarExpanded(false)
    }
  }, [hash, sidebarOpen])

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:arrows-exchange"
        title="Transactions"
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
          <div className="mt-8 size-full">
            <APIComponentWithFallback data={transactions}>
              {transactions =>
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
                        setReceiptModalOpen={setReceiptModalOpen}
                        setReceiptToView={setReceiptToView}
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
                    title={t('emptyState.wallet.transactions.title')}
                    description={t(
                      'emptyState.wallet.transactions.description'
                    )}
                    ctaContent="Add Transaction"
                    onCTAClick={setModifyModalOpenType}
                    icon="tabler:wallet-off"
                  />
                )
              }
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
        apiEndpoint="wallet/transactions"
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
      <ReceiptModal
        isOpen={receiptModalOpen}
        setOpen={setReceiptModalOpen}
        receiptSrc={receiptToView}
      />
    </ModuleWrapper>
  )
}

export default Transactions
