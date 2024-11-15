import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  useEffect(() => {
    const params = searchParams.get('type')
    if (params === null) return
    if (!['income', 'expenses', 'transfer'].includes(params)) {
      setSearchParams(searchParams => {
        searchParams.delete('type')
        return searchParams
      })
    }
  }, [searchParams])

  useEffect(() => {
    const params = searchParams.get('category')
    if (params === null || typeof categories === 'string') return
    if (
      categories.find(category => category.id === params) === undefined &&
      params !== 'all'
    ) {
      setSearchParams(searchParams => {
        searchParams.delete('category')
        return searchParams
      })
    }
  }, [searchParams, categories])

  useEffect(() => {
    const params = searchParams.get('asset')
    if (params === null || typeof assets === 'string') return
    if (
      assets.find(asset => asset.id === params) === undefined &&
      params !== 'all'
    ) {
      setSearchParams(searchParams => {
        searchParams.delete('asset')
        return searchParams
      })
    }
  }, [searchParams, assets])

  useEffect(() => {
    const params = searchParams.get('ledger')
    if (params === null || typeof ledgers === 'string') return
    if (
      ledgers.find(ledger => ledger.id === params) === undefined &&
      params !== 'all'
    ) {
      setSearchParams(searchParams => {
        searchParams.delete('ledger')
        return searchParams
      })
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
              data: ledgers
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
        <button
          onClick={() => {
            setSidebarOpen(true)
          }}
          className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
        >
          <Icon icon="tabler:menu" className="text-2xl" />
        </button>
      </div>
    </div>
  )
}

export default Header
