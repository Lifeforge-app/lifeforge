import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import { useWalletContext } from '@providers/WalletProvider'

function TransactionsHeader({
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
    <div className="flex flex-between">
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
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {Boolean(searchParams.get('type')) && (
            <span
              className={`flex-center flex gap-1 rounded-full px-2 py-1 text-sm ${
                {
                  income: 'bg-green-500/20 text-green-500',
                  expenses: 'bg-red-500/20 text-red-500',
                  transfer: 'bg-blue-500/20 text-blue-500'
                }[
                  searchParams.get('type') as 'income' | 'expenses' | 'transfer'
                ] ?? 'bg-bg-200 text-bg-500 dark:bg-bg-800 dark:text-bg-400'
              }`}
            >
              <Icon
                icon={
                  {
                    income: 'tabler:login-2',
                    expenses: 'tabler:logout',
                    transfer: 'tabler:transfer'
                  }[
                    searchParams.get('type') as
                      | 'income'
                      | 'expenses'
                      | 'transfer'
                  ]
                }
                className="size-4"
              />
              {(searchParams.get('type')?.[0].toUpperCase() ?? '') +
                searchParams.get('type')?.slice(1).toLowerCase()}
              <button
                onClick={() => {
                  setSearchParams(searchParams => {
                    searchParams.delete('type')
                    return searchParams
                  })
                }}
              >
                <Icon icon="tabler:x" className="size-4" />
              </button>
            </span>
          )}
          {typeof categories !== 'string' &&
            Boolean(searchParams.get('category')) && (
              <span
                className="flex-center flex gap-1 rounded-full px-2 py-1 text-sm"
                style={{
                  backgroundColor:
                    categories.find(
                      category => category.id === searchParams.get('category')
                    )?.color + '20',
                  color:
                    categories.find(
                      category => category.id === searchParams.get('category')
                    )?.color ?? 'black'
                }}
              >
                <Icon
                  icon={
                    categories.find(
                      category => category.id === searchParams.get('category')
                    )?.icon ?? ''
                  }
                  className="size-4"
                />
                {
                  categories.find(
                    category => category.id === searchParams.get('category')
                  )?.name
                }
                <button
                  onClick={() => {
                    setSearchParams(searchParams => {
                      searchParams.delete('category')
                      return searchParams
                    })
                  }}
                >
                  <Icon icon="tabler:x" className="size-4" />
                </button>
              </span>
            )}
          {typeof assets !== 'string' && Boolean(searchParams.get('asset')) && (
            <span className="flex-center flex gap-1 rounded-full bg-bg-200 px-2 py-1 text-sm text-bg-500 dark:bg-bg-800 dark:text-bg-400">
              <Icon
                icon={
                  assets.find(asset => asset.id === searchParams.get('asset'))
                    ?.icon ?? ''
                }
                className="size-4"
              />
              {
                assets.find(asset => asset.id === searchParams.get('asset'))
                  ?.name
              }
              <button
                onClick={() => {
                  setSearchParams(searchParams => {
                    searchParams.delete('asset')
                    return searchParams
                  })
                }}
              >
                <Icon icon="tabler:x" className="size-4" />
              </button>
            </span>
          )}
          {typeof ledgers !== 'string' &&
            Boolean(searchParams.get('ledger')) && (
              <span
                style={{
                  backgroundColor:
                    ledgers.find(
                      ledger => ledger.id === searchParams.get('ledger')
                    )?.color + '20',
                  color:
                    ledgers.find(
                      ledger => ledger.id === searchParams.get('ledger')
                    )?.color ?? 'black'
                }}
                className="flex-center flex gap-1 rounded-full px-2 py-1 text-sm"
              >
                <Icon
                  icon={
                    ledgers.find(
                      ledger => ledger.id === searchParams.get('ledger')
                    )?.icon ?? ''
                  }
                  className="size-4"
                />
                {
                  ledgers.find(
                    ledger => ledger.id === searchParams.get('ledger')
                  )?.name
                }
                <button
                  onClick={() => {
                    setSearchParams(searchParams => {
                      searchParams.delete('ledger')
                      return searchParams
                    })
                  }}
                >
                  <Icon icon="tabler:x" className="size-4" />
                </button>
              </span>
            )}
        </div>
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
          className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
        >
          <Icon icon="tabler:menu" className="text-2xl" />
        </button>
      </div>
    </div>
  )
}

export default TransactionsHeader
