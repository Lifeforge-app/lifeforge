import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'
import {
  Button,
  EmptyStateScreen,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ScanReceiptModal from './modals/ScanReceiptModal'
import ListView from './views/ListView'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.wallet.transactions.list
>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.wallet.categories.list
>[number]

function Transactions() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const {
    setSelectedType,
    setSelectedLedger,
    setSelectedAsset,
    setSelectedCategory,
    setSearchQuery
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

  const transactionsQuery = useQuery(
    forgeAPI.wallet.transactions.list.queryOptions()
  )

  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )

  console.log(
    [
      ...new Set(
        filteredTransactions
          .map(e => (e.type === 'income' ? e.particulars : ''))
          .filter(Boolean)
          .slice(0, 50)
      )
    ].join(', ')
  )

  console.log(
    [
      ...new Set(
        filteredTransactions
          .map(e => (e.type === 'expenses' ? e.particulars : ''))
          .filter(Boolean)
          .slice(0, 50)
      )
    ].join(', ')
  )

  const [searchParams] = useSearchParams()

  const { hash } = useLocation()

  const memoizedHeaderMenu = useMemo(
    () => <HeaderMenu />,
    [visibleColumn, setVisibleColumn]
  )

  const handleCreateTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'create',
      initialData: null
    })
  }, [])

  const handleUploadReceipt = useCallback(() => {
    open(ScanReceiptModal, {})
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyTransactionsModal, {
        type: 'create',
        initialData: null
      })
    }

    if (hash === '#scan') {
      open(ScanReceiptModal, {})
    }
  }, [hash])

  useEffect(() => {
    const query = searchParams.get('query')

    const type = searchParams.get('type')

    const ledger = searchParams.get('ledger')

    const asset = searchParams.get('asset')

    const category = searchParams.get('category')

    if (query) {
      setSearchQuery(query)
    }

    if (type && ['income', 'expenses', 'transfer'].includes(type)) {
      setSelectedType(type as WalletTransaction['type'])
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
          <SearchBar />
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

                return <ListView />
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
