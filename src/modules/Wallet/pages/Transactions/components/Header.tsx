import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import HeaderFilter from '@components/Miscellaneous/HeaderFilter'
import { useWalletContext } from '@providers/WalletProvider'

function Header({
  setModifyModalOpenType,
  setSidebarOpen
}: {
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const {
    categories,
    assets,
    ledgers,
    transactions,
    searchQuery,
    filteredTransactions
  } = useWalletContext()
  const { searchParams, setSearchParams } = useWalletContext()
  const { t } = useTranslation()

  useEffect(() => {
    const params = searchParams.get('type')
    if (params === null) return
    if (!['income', 'expenses', 'transfer'].includes(params)) {
      searchParams.delete('type')
      setSearchParams(searchParams)
    }
  }, [searchParams])

  useEffect(() => {
    const params = searchParams.get('category')
    if (params === null || typeof categories === 'string') return
    if (
      categories.find(category => category.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('category')
      setSearchParams(searchParams)
    }
  }, [searchParams, categories])

  useEffect(() => {
    const params = searchParams.get('asset')
    if (params === null || typeof assets === 'string') return
    if (
      assets.find(asset => asset.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('asset')

      setSearchParams(searchParams)
    }
  }, [searchParams, assets])

  useEffect(() => {
    const params = searchParams.get('ledger')
    if (params === null || typeof ledgers === 'string') return
    if (
      ledgers.find(ledger => ledger.id === params) === undefined &&
      params !== 'all'
    ) {
      searchParams.delete('ledger')
      setSearchParams(searchParams)
    }
  }, [searchParams, ledgers])

  return (
    <div className="flex-between flex">
      <div>
        <h1 className="text-3xl font-semibold lg:text-4xl">
          {t(
            `wallet.header.${
              searchParams.size === 0 && searchQuery === '' ? 'all' : 'filtered'
            }Transactions`
          )}{' '}
          <span className="text-base text-bg-500">
            ({filteredTransactions.length})
          </span>
        </h1>
        <HeaderFilter
          searchParams={searchParams}
          setSearchParams={setSearchParams}
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
        />
      </div>
      <div className="flex items-center gap-6">
        {typeof transactions !== 'string' && transactions.length > 0 && (
          <Button
            className="hidden md:flex"
            onClick={() => {
              setModifyModalOpenType('create')
            }}
            icon="tabler:plus"
          >
            Add Transaction
          </Button>
        )}
        <Button
          icon="tabler:menu"
          onClick={() => {
            setSidebarOpen(true)
          }}
          variant="no-bg"
          className="xl:hidden"
        />
      </div>
    </div>
  )
}

export default Header
