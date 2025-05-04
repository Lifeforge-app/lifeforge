import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import {
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

import { useModalStore } from '../../../../core/modals/useModalStore'
import useModalsEffect from '../../../../core/modals/useModalsEffect'
import { type IWalletTransaction } from '../../interfaces/wallet_interfaces'
import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import { walletTransactionsModals } from './modals'
import ListView from './views/ListView'
import ReceiptModal from './views/ListView/components/ReceiptModal'
import TableView from './views/TableView'

function Transactions() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.wallet')
  const {
    setSelectedType,
    setSelectedLedger,
    setSelectedAsset,
    setSelectedCategory
  } = useWalletStore()

  const navigate = useNavigate()
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

  const handleCreateTransaction = useCallback(() => {
    open('wallet.transactions.modifyTransaction', {
      type: 'create',
      existedData: null
    })
  }, [])

  const handleUploadReceipt = useCallback(() => {
    open('wallet.transactions.scanReceipt', {})
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      open('wallet.transactions.modifyTransaction', {
        type: 'create',
        existedData: null
      })
    }

    if (hash === '#scan') {
      open('wallet.transactions.scanReceipt', {})
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

  useModalsEffect(walletTransactionsModals)

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
          <InnerHeader />
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
                      onCTAClick={handleCreateTransaction}
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
                    return <TableView visibleColumn={visibleColumn} />
                  case 'list':
                    return (
                      <ListView
                        setReceiptModalOpen={setReceiptModalOpen}
                        setReceiptToView={setReceiptToView}
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
                    onClick={handleCreateTransaction}
                  />
                  <MenuItem
                    icon="tabler:scan"
                    namespace="apps.wallet"
                    text="Scan Receipt"
                    onClick={handleUploadReceipt}
                  />
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
      <ReceiptModal
        isOpen={receiptModalOpen}
        receiptSrc={receiptToView}
        setOpen={setReceiptModalOpen}
      />
    </ModuleWrapper>
  )
}

export default Transactions
