import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import {
  Button,
  EmptyStateScreen,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import useAPIQuery from '@hooks/useAPIQuery'

import { type IWalletTransaction } from '../../interfaces/wallet_interfaces'
import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ScanReceiptModal from './modals/ScanReceiptModal'
import ListView from './views/ListView'
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
    open(ModifyTransactionsModal, {
      type: 'create',
      existedData: null
    })
  }, [])

  const handleUploadReceipt = useCallback(() => {
    open(ScanReceiptModal, {})
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyTransactionsModal, {
        type: 'create',
        existedData: null
      })
    }

    if (hash === '#scan') {
      open(ScanReceiptModal, {})
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
        actionButton={
          (transactionsQuery.data?.length || 0) > 0 && (
            <Menu as="div" className="relative z-50 hidden md:block">
              <Button
                as={MenuButton}
                className="hidden md:flex"
                icon="tabler:plus"
                onClick={() => {}}
              >
                {t('common.buttons:new', {
                  item: t('apps.wallet:items.transaction')
                })}
              </Button>
              <MenuItems
                transition
                anchor="bottom end"
                className="bg-bg-100 dark:bg-bg-800 mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
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
          )
        }
        hamburgerMenuItems={memoizedHeaderMenu}
        icon="tabler:arrows-exchange"
        namespace="apps.wallet"
        title="Transactions"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="flex min-h-0 w-full min-w-0 flex-1">
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
                    return <ListView />
                }
              }}
            </QueryWrapper>
            {(transactionsQuery.data ?? []).length > 0 && (
              <Menu>
                <FAB as={MenuButton} hideWhen="md" />
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
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
    </ModuleWrapper>
  )
}

export default Transactions
