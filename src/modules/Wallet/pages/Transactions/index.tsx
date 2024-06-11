import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import useFetch from '@hooks/useFetch'
import {
  type IWalletLedgerEntry,
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import { numberToMoney, toCamelCase } from '@utils/strings'
import ManageCategoriesModal from './components/ManageCategoriesModal'
import ModifyTransactionsModal from './components/ModifyTransactionsModal'

function Transactions(): React.ReactElement {
  const [transactions, refreshTransactions] = useFetch<
    IWalletTransactionEntry[]
  >('wallet/transactions/list')
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [ledgers] = useFetch<IWalletLedgerEntry[]>('wallet/ledgers/list')
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )
  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [visibleColumn, setVisibleColumn] = useState([
    'Date',
    'Type',
    'Ledger',
    'Asset',
    'Particular',
    'Category',
    'Amount',
    'Receipt'
  ])
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const [isManageCategoriesModalOpen, setManageCategoriesModalOpen] =
    useState(false)
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState<'list' | 'table'>('table')
  const { hash } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      navigate('/wallet/transactions')
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Transactions"
        desc="Manage your Transactions here."
        actionButton={
          typeof transactions !== 'string' &&
          transactions.length > 0 && (
            <Button
              className="hidden md:flex"
              onClick={() => {
                setModifyModalOpenType('create')
              }}
              icon="tabler:plus"
            >
              Add Transaction
            </Button>
          )
        }
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
            <SidebarDivider noMargin />
            <span className="flex items-center gap-4 p-4 text-bg-500">
              <Icon icon="tabler:eye" className="size-5" />
              Columns Visibility
            </span>
            <div className="p-4 pt-0">
              <ul className="flex flex-col divide-y divide-bg-700 overflow-hidden rounded-md bg-bg-700/50">
                {[
                  'Date',
                  'Type',
                  'Ledger',
                  'Asset',
                  'Particular',
                  'Category',
                  'Amount',
                  'Receipt'
                ].map(column => (
                  <MenuItem
                    key={column}
                    text={t(`table.${toCamelCase(column)}`)}
                    onClick={() => {
                      if (visibleColumn.includes(column)) {
                        setVisibleColumn(
                          visibleColumn.filter(e => e !== column)
                        )
                      } else {
                        setVisibleColumn([...visibleColumn, column])
                      }
                    }}
                    isToggled={visibleColumn.includes(column)}
                  />
                ))}
              </ul>
            </div>
          </>
        }
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <aside
          className={`absolute ${
            sidebarOpen ? 'left-0' : 'left-full'
          } top-0 z-[9999] size-full min-w-0 overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
        >
          <div className="flex items-center justify-between px-8 py-4 lg:hidden">
            <GoBackButton
              onClick={() => {
                setSidebarOpen(false)
              }}
            />
          </div>
          <ul className="flex min-w-0 flex-col overflow-y-hidden hover:overflow-y-scroll">
            <SidebarItem icon="tabler:list" name="All Transactions" />
            <SidebarDivider />
            <SidebarTitle name="Type" />
            {[
              ['tabler:login-2', 'Income'],
              ['tabler:logout', 'Expenses'],
              ['tabler:transfer', 'Transfer']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                  <Icon icon={icon} className="size-6 shrink-0" />
                  <div className="flex w-full items-center justify-between">
                    {name}
                  </div>
                  <span className="text-sm">
                    {Math.floor(Math.random() * 10)}
                  </span>
                </div>
              </li>
            ))}
            <SidebarDivider />
            <SidebarTitle name="categories" />
            <APIComponentWithFallback data={categories}>
              {typeof categories !== 'string' &&
                categories.map(({ icon, name, color, id }, index) => (
                  <li
                    key={index}
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                      <span
                        className="block h-8 w-1 shrink-0 rounded-full"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <Icon icon={icon} className="size-6 shrink-0" />
                      <div className="flex w-full items-center justify-between">
                        {name}
                      </div>
                      <span className="text-sm">
                        {typeof transactions !== 'string' &&
                          transactions.filter(
                            transaction => transaction.category === id
                          ).length}
                      </span>
                    </div>
                  </li>
                ))}
            </APIComponentWithFallback>
            <SidebarDivider />
            <SidebarTitle name="Assets" />
            <APIComponentWithFallback data={assets}>
              {typeof assets !== 'string' &&
                assets.map(({ icon, name, id }, index) => (
                  <li
                    key={index}
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                      <Icon icon={icon} className="size-6 shrink-0" />
                      <div className="flex w-full items-center justify-between">
                        {name}
                      </div>
                      <span className="text-sm">
                        {typeof transactions !== 'string' &&
                          transactions.filter(
                            transaction => transaction.asset === id
                          ).length}
                      </span>
                    </div>
                  </li>
                ))}
            </APIComponentWithFallback>
            <SidebarDivider />
            <SidebarTitle name="Ledgers" />
            <APIComponentWithFallback data={ledgers}>
              {typeof ledgers !== 'string' &&
                ledgers.map(({ icon, name, color, id }, index) => (
                  <li
                    key={index}
                    className="relative flex min-w-0 items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                  >
                    <div className="flex w-full min-w-0 items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                      <span
                        className="block h-8 w-1 shrink-0 rounded-full"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <Icon icon={icon} className="size-6 shrink-0" />
                      <div className="w-full min-w-0 items-center justify-between truncate">
                        {name}
                      </div>
                      <span className="text-sm">
                        {typeof transactions !== 'string' &&
                          transactions.filter(
                            transaction => transaction.ledger === id
                          ).length}
                      </span>
                    </div>
                  </li>
                ))}
            </APIComponentWithFallback>
          </ul>
        </aside>
        <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col lg:ml-8">
          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="transactions"
            />
            <div className="mt-2 flex items-center gap-2 rounded-md bg-bg-900 p-2 sm:mt-6">
              {['table', 'list'].map(viewType => (
                <button
                  key={viewType}
                  onClick={() => {
                    setView(viewType as 'table' | 'list')
                  }}
                  className={`flex items-center gap-2 rounded-md p-2 transition-all ${
                    viewType === view
                      ? 'bg-bg-800'
                      : 'text-bg-500 hover:text-bg-100'
                  }`}
                >
                  <Icon
                    icon={
                      viewType === 'table'
                        ? 'tabler:table'
                        : viewType === 'list'
                        ? 'uil:list-ul'
                        : ''
                    }
                    className="size-6"
                  />
                </button>
              ))}
            </div>
          </div>
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
                view === 'list' ? (
                  <table className="mb-8 w-full">
                    <thead>
                      <tr className="border-b-2 border-bg-200 text-bg-500 dark:border-bg-800">
                        {[
                          'Date',
                          'Type',
                          'Asset',
                          'Ledger',
                          'Particular',
                          'Category',
                          'Amount',
                          'Receipt',
                          ''
                        ].map(
                          column =>
                            (visibleColumn.includes(column) ||
                              column === '') && (
                              <th
                                key={column}
                                className={`py-2 font-medium ${
                                  column === 'Particular' && 'text-left'
                                }`}
                              >
                                {column !== '' &&
                                  t(`table.${toCamelCase(column)}`)}
                              </th>
                            )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr
                          key={transaction.id}
                          className="border-b border-bg-200 dark:border-bg-800"
                        >
                          {visibleColumn.includes('Date') && (
                            <td className="whitespace-nowrap p-2 text-center">
                              {moment(transaction.date).format('MMM DD, YYYY')}
                            </td>
                          )}
                          {visibleColumn.includes('Type') && (
                            <td className="p-4 text-center">
                              <span
                                className={`rounded-full px-3 py-1 text-sm ${
                                  {
                                    income: 'bg-green-500/20 text-green-500',
                                    expenses: 'bg-red-500/20 text-red-500',
                                    transfer: 'bg-blue-500/20 text-blue-500'
                                  }[transaction.type]
                                }`}
                              >
                                {transaction.type[0].toUpperCase() +
                                  transaction.type.slice(1)}
                              </span>
                            </td>
                          )}
                          {visibleColumn.includes('Ledger') && (
                            <td className="p-2 text-center">
                              {transaction.ledger !== '' ? (
                                <span
                                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
                                  style={{
                                    backgroundColor:
                                      ledgers.find(
                                        ledger =>
                                          ledger.id === transaction.ledger
                                      )?.color + '20',
                                    color: ledgers.find(
                                      ledger => ledger.id === transaction.ledger
                                    )?.color
                                  }}
                                >
                                  <Icon
                                    icon={
                                      ledgers.find(
                                        ledgers =>
                                          ledgers.id === transaction.ledger
                                      )?.icon ?? ''
                                    }
                                    className="size-4"
                                  />
                                  {
                                    ledgers.find(
                                      ledger => ledger.id === transaction.ledger
                                    )?.name
                                  }
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          )}
                          {visibleColumn.includes('Asset') && (
                            <td className="p-2 text-center">
                              <span className="inline-flex w-min items-center gap-1 whitespace-nowrap rounded-full bg-bg-200 px-3 py-1 text-sm text-bg-500 dark:bg-bg-800 dark:text-bg-400">
                                <Icon
                                  icon={
                                    assets.find(
                                      asset => asset.id === transaction.asset
                                    )?.icon ?? ''
                                  }
                                  className="size-4 shrink-0"
                                />
                                {
                                  assets.find(
                                    asset => asset.id === transaction.asset
                                  )?.name
                                }
                              </span>
                            </td>
                          )}
                          {visibleColumn.includes('Particular') && (
                            <td className="min-w-96 p-2">
                              {transaction.particulars}
                            </td>
                          )}
                          {visibleColumn.includes('Category') && (
                            <td className="p-2 text-center">
                              {transaction.category !== '' ? (
                                <span
                                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
                                  style={{
                                    backgroundColor:
                                      categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.color + '20',
                                    color: categories.find(
                                      category =>
                                        category.id === transaction.category
                                    )?.color
                                  }}
                                >
                                  <Icon
                                    icon={
                                      categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.icon ?? ''
                                    }
                                    className="size-4"
                                  />
                                  {
                                    categories.find(
                                      category =>
                                        category.id === transaction.category
                                    )?.name
                                  }
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          )}
                          {visibleColumn.includes('Amount') && (
                            <td className="p-2 text-center">
                              <span
                                className={`${
                                  {
                                    debit: 'text-green-500',
                                    credit: 'text-red-500'
                                  }[transaction.side]
                                }`}
                              >
                                {transaction.side === 'debit' ? '+' : '-'}
                                {numberToMoney(transaction.amount)}
                              </span>
                            </td>
                          )}
                          {visibleColumn.includes('Receipt') && (
                            <td className="p-2 text-center">
                              {transaction.receipt !== '' ? (
                                <Zoom zoomMargin={100}>
                                  <img
                                    alt=""
                                    src={`${
                                      import.meta.env.VITE_API_HOST
                                    }/media/${transaction.collectionId}/${
                                      transaction.id
                                    }/${transaction.receipt}`}
                                    className={
                                      'mx-auto size-12 rounded-lg bg-bg-200 object-cover dark:bg-bg-800'
                                    }
                                  />
                                </Zoom>
                              ) : (
                                '-'
                              )}
                            </td>
                          )}
                          <td className="p-2">
                            <HamburgerMenu className="relative">
                              {transaction.type !== 'transfer' && (
                                <MenuItem
                                  icon="tabler:pencil"
                                  text="Edit"
                                  onClick={() => {
                                    setSelectedData(transaction)
                                    setModifyModalOpenType('update')
                                  }}
                                />
                              )}
                              <MenuItem
                                icon="tabler:trash"
                                text="Delete"
                                isRed
                                onClick={() => {
                                  setSelectedData(transaction)
                                  setDeleteTransactionsConfirmationOpen(true)
                                }}
                              />
                            </HamburgerMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <ul className="flex min-h-0 flex-col gap-6 overflow-y-auto">
                    {transactions.map(transaction => (
                      <li
                        key={transaction.id}
                        className="relative flex items-center gap-2 rounded-lg"
                      >
                        <div
                          className="h-12 w-1 rounded-full"
                          style={{
                            backgroundColor:
                              categories.find(
                                category => category.id === transaction.category
                              )?.color ?? 'transparent'
                          }}
                        />
                        <div>
                          <div className="text-lg font-medium text-bg-100">
                            {transaction.particulars}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-bg-500">
                            {moment(transaction.date).format('MMM DD, YYYY')}
                            <Icon
                              icon="tabler:circle-filled"
                              className="size-1"
                            />
                            {transaction.type[0].toUpperCase() +
                              transaction.type.slice(1)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <EmptyStateScreen
                  title="Oops! No Transaction found."
                  description="You don't have any Transactions yet. Add some to get started."
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
        refreshTransactions={refreshTransactions}
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
        updateDataList={refreshTransactions}
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
