import { Menu, MenuButton, MenuItems } from '@headlessui/react'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { FAB } from '@components/buttons'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ManageCategoriesModal from './modals/ManageCategoriesModal'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ScanReceiptModal from './modals/ScanReceiptModal'
import ListView from './views/ListView'
import ReceiptModal from './views/ListView/components/ReceiptModal'
import TableView from './views/TableView'
import ColumnVisibilityToggle from './views/TableView/components/ColumnVisibilityToggle'

function Transactions(): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
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

    if (hash === '#scan') {
      setIsUploadReceiptModalOpen(true)
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:apps"
              namespace="modules.wallet"
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
                    icon={type === 'list' ? 'uil:apps' : 'uil:list-ul'}
                    isToggled={view === type}
                    text={type.charAt(0).toUpperCase() + type.slice(1)}
                    onClick={() => {
                      setView(type as 'list' | 'table')
                    }}
                  />
                ))}
              </HamburgerSelectorWrapper>
            </div>
            {view === 'table' && (
              <ColumnVisibilityToggle
                setVisibleColumn={setVisibleColumn}
                visibleColumn={visibleColumn}
              />
            )}
          </>
        }
        icon="tabler:arrows-exchange"
        title="Transactions"
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar
          setManageCategoriesModalOpen={setManageCategoriesModalOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex h-full min-w-0 flex-1 flex-col xl:ml-8">
          <Header
            setModifyModalOpenType={setModifyModalOpenType}
            setSidebarOpen={setSidebarOpen}
            setUploadReceiptModalOpen={setIsUploadReceiptModalOpen}
          />
          <SearchBar setView={setView} view={view} />
          <div className="mt-6 size-full">
            <APIFallbackComponent data={transactions}>
              {transactions => {
                if (transactions.length === 0) {
                  return (
                    <EmptyStateScreen
                      ctaContent="new"
                      ctaTProps={{
                        item: t('items.transaction')
                      }}
                      icon="tabler:wallet-off"
                      name="transactions"
                      namespace="modules.wallet"
                      onCTAClick={setModifyModalOpenType}
                    />
                  )
                }

                if (filteredTransactions.length === 0) {
                  return (
                    <EmptyStateScreen
                      icon="tabler:filter-off"
                      name="results"
                      namespace="modules.wallet"
                    />
                  )
                }

                switch (view) {
                  case 'table':
                    return (
                      <TableView
                        setDeleteTransactionsConfirmationOpen={
                          setDeleteTransactionsConfirmationOpen
                        }
                        setModifyModalOpenType={setModifyModalOpenType}
                        setSelectedData={setSelectedData}
                        visibleColumn={visibleColumn}
                      />
                    )
                  case 'list':
                    return (
                      <ListView
                        setDeleteTransactionsConfirmationOpen={
                          setDeleteTransactionsConfirmationOpen
                        }
                        setModifyModalOpenType={setModifyModalOpenType}
                        setReceiptModalOpen={setReceiptModalOpen}
                        setReceiptToView={setReceiptToView}
                        setSelectedData={setSelectedData}
                      />
                    )
                }
              }}
            </APIFallbackComponent>
            {transactions.length > 0 && (
              <Menu>
                <FAB as={MenuButton} hideWhen="md" />
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
                >
                  <MenuItem
                    icon="tabler:plus"
                    namespace="modules.wallet"
                    text="Add Manually"
                    onClick={() => {
                      setSelectedData(null)
                      setModifyModalOpenType('create')
                    }}
                  />
                  <MenuItem
                    icon="tabler:scan"
                    namespace="modules.wallet"
                    text="Scan Receipt"
                    onClick={() => {
                      setIsUploadReceiptModalOpen(true)
                    }}
                  />
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
      <ModifyTransactionsModal
        existedData={selectedData}
        openType={modifyTransactionsModalOpenType}
        setExistedData={setSelectedData}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/transactions"
        data={selectedData}
        isOpen={deleteTransactionsConfirmationOpen}
        itemName="transaction"
        updateDataList={() => {
          refreshTransactions()
          refreshAssets()
        }}
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
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
        receiptSrc={receiptToView}
        setOpen={setReceiptModalOpen}
      />
      <ScanReceiptModal
        open={isUploadReceiptModaLOpen}
        setExistedData={setSelectedData}
        setModifyModalOpenType={setModifyModalOpenType}
        setOpen={setIsUploadReceiptModalOpen}
      />
    </ModuleWrapper>
  )
}

export default Transactions
