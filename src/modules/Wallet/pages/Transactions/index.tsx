import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import ManageCategoriesModal from './components/ManageCategoriesModal'
import ModifyTransactionsModal from './components/ModifyTransactionsModal'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import ListView from './views/ListView'
import TableView from './views/TableView'
import ColumnVisibilityToggle from './views/TableView/components/ColumnVisibilityToggle'

function Transactions(): React.ReactElement {
  const {
    transactions,
    refreshTransactions,
    ledgers,
    assets,
    refreshAssets,
    categories,
    refreshCategories
  } = useWalletContext()

  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [visibleColumn, setVisibleColumn] = useState([
    'Date',
    'Type',
    'Ledger',
    'Asset',
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
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'list' | 'table'>('list')
  const [searchParams, setSearchParams] = useSearchParams()
  const [filteredTransactions, setFilteredTransactions] = useState<
    IWalletTransactionEntry[]
  >([])
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      navigate('/wallet/transactions')
    }
  }, [hash])

  useEffect(() => {
    if (typeof transactions === 'string') return

    setFilteredTransactions(
      transactions
        .filter(transaction => {
          return ['type', 'category', 'asset', 'ledger'].every(
            item =>
              ['all', null].includes(searchParams.get(item)) ||
              transaction[item as 'type' | 'category' | 'asset' | 'ledger'] ===
                searchParams.get(item)
          )
        })
        .filter(transaction => {
          return (
            debouncedSearchQuery === '' ||
            transaction.particulars
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        })
    )
  }, [searchParams, transactions, debouncedSearchQuery])

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
    <ModuleWrapper>
      <ModuleHeader
        title="Transactions"
        desc="Manage your Transactions here."
        hasHamburgerMenu
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:apps"
              text="Manage Categories"
              onClick={() => {
                setManageCategoriesModalOpen(true)
              }}
            />
            {view === 'table' && (
              <ColumnVisibilityToggle
                visibleColumn={visibleColumn}
                setVisibleColumn={setVisibleColumn}
              />
            )}
          </>
        }
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setManageCategoriesModalOpen={setManageCategoriesModalOpen}
        />
        <div className="flex h-full min-w-0 flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold lg:text-4xl">
                {searchParams.size === 0 && searchQuery === ''
                  ? 'All'
                  : 'Filtered'}{' '}
                Transactions <span className="text-base text-bg-500">(10)</span>
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
                        searchParams.get('type') as
                          | 'income'
                          | 'expenses'
                          | 'transfer'
                      ] ??
                      'bg-bg-200 text-bg-500 dark:bg-bg-800 dark:text-bg-400'
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
                            category =>
                              category.id === searchParams.get('category')
                          )?.color + '20' ?? 'transparent',
                        color:
                          categories.find(
                            category =>
                              category.id === searchParams.get('category')
                          )?.color ?? 'black'
                      }}
                    >
                      <Icon
                        icon={
                          categories.find(
                            category =>
                              category.id === searchParams.get('category')
                          )?.icon ?? ''
                        }
                        className="size-4"
                      />
                      {
                        categories.find(
                          category =>
                            category.id === searchParams.get('category')
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
                {typeof assets !== 'string' &&
                  Boolean(searchParams.get('asset')) && (
                    <span className="flex-center flex gap-1 rounded-full bg-bg-200 px-2 py-1 text-sm text-bg-500 dark:bg-bg-800 dark:text-bg-400">
                      <Icon
                        icon={
                          assets.find(
                            asset => asset.id === searchParams.get('asset')
                          )?.icon ?? ''
                        }
                        className="size-4"
                      />
                      {
                        assets.find(
                          asset => asset.id === searchParams.get('asset')
                        )?.name
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
                          )?.color + '20' ?? 'transparent',
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
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setView={setView}
            view={view}
          />
          <div className="mt-8 size-full overflow-y-auto">
            <APIComponentWithFallback
              data={
                [transactions, categories, assets, ledgers].find(e =>
                  ['loading', 'error'].includes(e as string)
                ) ?? transactions
              }
            >
              {typeof transactions !== 'string' &&
              typeof categories !== 'string' &&
              typeof assets !== 'string' &&
              typeof ledgers !== 'string' &&
              transactions.length > 0 ? (
                filteredTransactions.length > 0 ? (
                  view === 'table' ? (
                    <TableView
                      transactions={filteredTransactions}
                      categories={categories}
                      assets={assets}
                      ledgers={ledgers}
                      visibleColumn={visibleColumn}
                      setDeleteTransactionsConfirmationOpen={
                        setDeleteTransactionsConfirmationOpen
                      }
                      setModifyModalOpenType={setModifyModalOpenType}
                      setSelectedData={setSelectedData}
                    />
                  ) : (
                    <ListView
                      transactions={filteredTransactions}
                      categories={categories}
                      assets={assets}
                      ledgers={ledgers}
                      setDeleteTransactionsConfirmationOpen={
                        setDeleteTransactionsConfirmationOpen
                      }
                      setModifyModalOpenType={setModifyModalOpenType}
                      setSelectedData={setSelectedData}
                    />
                  )
                ) : (
                  <EmptyStateScreen
                    title="Oops! No Transaction found."
                    description="No transactions found with the selected filters."
                    icon="tabler:filter-off"
                  />
                )
              ) : (
                <EmptyStateScreen
                  title="Oops! No Transaction found."
                  description="You don't have any transactions yet. Add some to get started."
                  ctaContent="Add Transaction"
                  setModifyModalOpenType={setModifyModalOpenType}
                  icon="tabler:wallet-off"
                />
              )}
            </APIComponentWithFallback>
            {transactions.length > 0 && (
              <FAB
                onClick={() => {
                  setSelectedData(null)
                  setModifyModalOpenType('create')
                }}
                hideWhen="md"
              />
            )}
          </div>
        </div>
      </div>
      <ModifyTransactionsModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyTransactionsModalOpenType}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/Transactions/delete"
        isOpen={deleteTransactionsConfirmationOpen}
        data={selectedData}
        itemName="transaction"
        onClose={() => {
          setDeleteTransactionsConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={() => {
          refreshTransactions()
          refreshAssets()
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
    </ModuleWrapper>
  )
}

export default Transactions
