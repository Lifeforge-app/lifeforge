import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import type { InferOutput } from 'shared'

import { useWalletStore } from '@apps/03.Finance/Wallet/stores/useWalletStore'

import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import TransactionList from './components/TransactionList'
import ManageTemplatesModal from './modals/ManageTemplatesModal'
import ModifyTransactionsModal from './modals/ModifyTransactionsModal'
import ScanReceiptModal from './modals/ScanReceiptModal'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.wallet.transactions.list
>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.wallet.categories.list
>[number]

function Transactions() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  // TODO: Migrate to nuqs
  const {
    setSelectedType,
    setSelectedLedger,
    setSelectedAsset,
    setSelectedCategory,
    setSearchQuery
  } = useWalletStore()

  const navigate = useNavigate()

  const transactionsQuery = useQuery(
    forgeAPI.wallet.transactions.list.queryOptions()
  )

  const [searchParams] = useSearchParams()

  const { hash } = useLocation()

  const handleCreateTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'create'
    })
  }, [])

  const handleUploadReceipt = useCallback(() => {
    open(ScanReceiptModal, {})
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyTransactionsModal, {
        type: 'create'
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
    <>
      <ModuleHeader
        actionButton={
          (transactionsQuery.data?.length || 0) > 0 && (
            <ContextMenu
              buttonComponent={
                <Button
                  className="hidden md:flex"
                  icon="tabler:plus"
                  tProps={{ item: t('apps.wallet:items.transaction') }}
                  onClick={() => {}}
                >
                  new
                </Button>
              }
              classNames={{ button: 'hidden:md:block' }}
            >
              <ContextMenuItem
                icon="tabler:plus"
                label="Add Manually"
                namespace="apps.wallet"
                onClick={handleCreateTransaction}
              />
              <ContextMenuItem
                icon="tabler:template"
                label="From Template"
                namespace="apps.wallet"
                onClick={() => {
                  open(ManageTemplatesModal, {
                    choosing: true
                  })
                }}
              />
              <ContextMenuItem
                icon="tabler:scan"
                label="Scan Receipt"
                namespace="apps.wallet"
                onClick={handleUploadReceipt}
              />
            </ContextMenu>
          )
        }
        contextMenuProps={{
          children: <HeaderMenu />
        }}
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
          <div className="mt-6 mb-8 flex size-full flex-col gap-3">
            <WithQuery query={transactionsQuery}>
              {transactions =>
                transactions.length > 0 ? (
                  <TransactionList />
                ) : (
                  <EmptyStateScreen
                    CTAButtonProps={{
                      children: 'new',
                      icon: 'tabler:plus',
                      onClick: handleCreateTransaction,
                      tProps: { item: t('items.transaction') }
                    }}
                    icon="tabler:wallet-off"
                    name="transactions"
                    namespace="apps.wallet"
                  />
                )
              }
            </WithQuery>
            {(transactionsQuery.data ?? []).length > 0 && (
              <ContextMenu
                buttonComponent={
                  <FAB className="static!" visibilityBreakpoint="md" />
                }
                classNames={{
                  wrapper: 'w-min! fixed right-6 bottom-6'
                }}
              >
                <ContextMenuItem
                  icon="tabler:plus"
                  label="Add Manually"
                  namespace="apps.wallet"
                  onClick={handleCreateTransaction}
                />
                <ContextMenuItem
                  icon="tabler:template"
                  label="From Template"
                  namespace="apps.wallet"
                  onClick={() => {
                    open(ManageTemplatesModal, {
                      choosing: true
                    })
                  }}
                />
                <ContextMenuItem
                  icon="tabler:scan"
                  label="Scan Receipt"
                  namespace="apps.wallet"
                  onClick={handleUploadReceipt}
                />
              </ContextMenu>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Transactions
