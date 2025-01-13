import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import FAB from '@components/ButtonsAndInputs/FAB'
import HamburgerSelectorWrapper from '@components/ButtonsAndInputs/HamburgerMenu/HamburgerSelectorWrapper'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { useWalletContext } from '@providers/WalletProvider'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ManageCategoriesModal from './modals/ManageCategoriesModal'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import UploadReceiptModal from './modals/UploadReceiptModal'
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
    filteredTransactions,
    searchParams
  } = useWalletContext()

  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [isUploadReceiptModaLOpen, setIsUploadReceiptModalOpen] =
    useState(false)
  const [visibleColumn, setVisibleColumn] = useState([
    'Date',
    'Type',
    'Ledger',
    'Asset',
    'Location',
    'Particulars',
    'Category',
    'Amount',
    'Receipt'
  ])
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const { setSubSidebarExpanded, subSidebarExpanded } = useGlobalStateContext()
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
    }
  }, [hash])

  useEffect(() => {
    console.log(subSidebarExpanded)
    if (sidebarOpen) {
      setSubSidebarExpanded(true)
    } else {
      setSubSidebarExpanded(false)
    }
  }, [sidebarOpen, setSubSidebarExpanded, searchParams])

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
            <div className="block md:hidden">
              <HamburgerSelectorWrapper icon="tabler:eye" title="View as">
                {['list', 'table'].map(type => (
                  <MenuItem
                    key={type}
                    text={type.charAt(0).toUpperCase() + type.slice(1)}
                    icon={type === 'list' ? 'uil:apps' : 'uil:list-ul'}
                    onClick={() => {
                      setView(type as 'list' | 'table')
                    }}
                    isToggled={view === type}
                    needTranslate={false}
                  />
                ))}
              </HamburgerSelectorWrapper>
            </div>
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
        <div className="flex h-full min-w-0 flex-1 flex-col xl:ml-8">
          <Header
            setModifyModalOpenType={setModifyModalOpenType}
            setUploadReceiptModalOpen={setIsUploadReceiptModalOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <SearchBar setView={setView} view={view} />
          <div className="mt-6 size-full">
            <APIFallbackComponent data={transactions}>
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
            </APIFallbackComponent>
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
        updateDataLists={() => {
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
      <UploadReceiptModal
        open={isUploadReceiptModaLOpen}
        setOpen={setIsUploadReceiptModalOpen}
        setExistedData={setSelectedData}
        setModifyModalOpenType={setModifyModalOpenType}
      />
    </ModuleWrapper>
  )
}

export default Transactions
