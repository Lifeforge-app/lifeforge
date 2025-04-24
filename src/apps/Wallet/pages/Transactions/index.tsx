import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import {
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import useAPIQuery from '@hooks/useAPIQuery'

import { type IWalletTransaction } from '../../interfaces/wallet_interfaces'
import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ManageCategoriesModal from './modals/ManageCategoriesModal'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ScanReceiptModal from './modals/ScanReceiptModal'
import ListView from './views/ListView'
import ReceiptModal from './views/ListView/components/ReceiptModal'
import TableView from './views/TableView'

function Transactions() {
  const { t } = useTranslation('apps.wallet')
  const {
    setSelectedType,
    setSelectedLedger,
    setSelectedAsset,
    setSelectedCategory
  } = useWalletStore()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
  const [selectedData, setSelectedData] =
    useState<Partial<IWalletTransaction> | null>(null)
  const [view, setView] = useState<'list' | 'table'>('list')
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [receiptToView, setReceiptToView] = useState('')
  const transactionsQuery = useAPIQuery<IWalletTransaction[]>(
    'wallet/transactions',
    ['wallet', 'transactions']
  )

  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )
  const [searchParams] = useSearchParams()

  const { hash } = useLocation()

  const memoizedHeaderMenu = useMemo(
    () => (
      <HeaderMenu
        setView={setView}
        setVisibleColumn={setVisibleColumn}
        view={view}
        visibleColumn={visibleColumn}
      />
    ),
    [setView, view, visibleColumn, setVisibleColumn]
  )

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
    }

    if (hash === '#scan') {
      setIsUploadReceiptModalOpen(true)
    }
  }, [hash])

  useEffect(() => {
    const type = searchParams.get('type')
    const ledger = searchParams.get('ledger')
    const asset = searchParams.get('asset')
    const category = searchParams.get('category')

    if (type && ['income', 'expenses', 'transfer'].includes(type)) {
      setSelectedType(type as IWalletTransaction['type'])
    }

    if (ledger) {
      setSelectedLedger(ledger)
    }

    if (asset) {
      setSelectedAsset(asset)
    }

    if (category) {
      setSelectedCategory(category)
    }

    navigate('/wallet/transactions', {
      replace: true
    })
  }, [searchParams])

  return (
    <ModuleWrapper>
      <ModuleHeader
        hamburgerMenuItems={memoizedHeaderMenu}
        icon="tabler:arrows-exchange"
        namespace="apps.wallet"
        title="Transactions"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-w-0 flex-1 flex-col xl:ml-8">
          <InnerHeader
            setModifyModalOpenType={setModifyModalOpenType}
            setUploadReceiptModalOpen={setIsUploadReceiptModalOpen}
          />
          <SearchBar setView={setView} view={view} />
          <div className="mt-6 size-full">
            <QueryWrapper query={transactionsQuery}>
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
                      namespace="apps.wallet"
                      onCTAClick={setModifyModalOpenType}
                    />
                  )
                }

                if (filteredTransactions.length === 0) {
                  return (
                    <EmptyStateScreen
                      icon="tabler:filter-off"
                      name="results"
                      namespace="apps.wallet"
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
            </QueryWrapper>
            {(transactionsQuery.data ?? []).length > 0 && (
              <Menu>
                <FAB as={MenuButton} hideWhen="md" />
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="bg-bg-100 dark:bg-bg-800 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem
                    icon="tabler:plus"
                    namespace="apps.wallet"
                    text="Add Manually"
                    onClick={() => {
                      setSelectedData(null)
                      setModifyModalOpenType('create')
                    }}
                  />
                  <MenuItem
                    icon="tabler:scan"
                    namespace="apps.wallet"
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
        data={selectedData ?? undefined}
        isOpen={deleteTransactionsConfirmationOpen}
        itemName="transaction"
        queryKey={['wallet', 'transactions']}
        updateDataList={() => {
          queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
          queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
          queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
        }}
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
        }}
      />
      <ManageCategoriesModal />
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
