import { Button, HeaderFilter, useModuleSidebarState } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useFilteredTransactions } from '@apps/03.Finance/Wallet/hooks/useFilteredTransactions'
import { useWalletData } from '@apps/03.Finance/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/03.Finance/Wallet/stores/useWalletStore'

function InnerHeader() {
  const { transactionsQuery, assetsQuery, categoriesQuery, ledgersQuery } =
    useWalletData()

  const {
    searchQuery,
    selectedType,
    selectedCategory,
    selectedAsset,
    selectedLedger,
    setSelectedType,
    setSelectedCategory,
    setSelectedAsset,
    setSelectedLedger
  } = useWalletStore()

  const { setIsSidebarOpen } = useModuleSidebarState()

  const { t } = useTranslation(['common.buttons', 'apps.wallet'])

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )

  return (
    <div className="flex-between flex">
      <div>
        <h1 className="text-3xl font-semibold lg:text-4xl">
          {t(
            `apps.wallet:header.${
              !selectedType &&
              !selectedCategory &&
              !selectedAsset &&
              !selectedLedger &&
              searchQuery === ''
                ? 'all'
                : 'filtered'
            }Transactions`
          )}{' '}
          <span className="text-bg-500 text-base">
            ({filteredTransactions.length.toLocaleString()})
          </span>
        </h1>
        <HeaderFilter
          items={{
            type: {
              data: [
                {
                  id: 'income',
                  icon: 'tabler:login-2',
                  name: 'Income',
                  color: '#22c55e'
                },
                {
                  id: 'expenses',
                  icon: 'tabler:logout',
                  name: 'Expenses',
                  color: '#ef4444'
                },
                {
                  id: 'transfer',
                  icon: 'tabler:transfer',
                  name: 'Transfer',
                  color: '#3b82f6'
                }
              ],
              isColored: true
            },
            category: {
              data: categories,
              isColored: true
            },
            asset: {
              data: assets
            },
            ledger: {
              data: ledgers,
              isColored: true
            }
          }}
          setValues={{
            type: setSelectedType as (value: string | null) => void,
            category: setSelectedCategory,
            asset: setSelectedAsset,
            ledger: setSelectedLedger
          }}
          values={{
            type: selectedType,
            category: selectedCategory,
            asset: selectedAsset,
            ledger: selectedLedger
          }}
        />
      </div>
      <Button
        className="xl:hidden"
        icon="tabler:menu"
        variant="plain"
        onClick={() => {
          setIsSidebarOpen(true)
        }}
      />
    </div>
  )
}

export default InnerHeader
