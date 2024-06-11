import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
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
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )
  const [modifyTransactionsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteTransactionsConfirmationOpen,
    setDeleteTransactionsConfirmationOpen
  ] = useState(false)
  const [isManageCategoriesModalOpen, setManageCategoriesModalOpen] =
    useState(false)
  const [selectedData, setSelectedData] =
    useState<IWalletTransactionEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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
          </>
        }
      />
      <SearchInput
        stuffToSearch="transactions"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="mt-8 size-full overflow-y-auto">
        <APIComponentWithFallback
          data={
            [transactions, categories, assets].find(e =>
              ['loading', 'error'].includes(e as string)
            ) ?? transactions
          }
        >
          {typeof transactions !== 'string' &&
          typeof categories !== 'string' &&
          typeof assets !== 'string' &&
          transactions.length > 0 ? (
            <table className="mb-8 w-full">
              <thead>
                <tr className="border-b-2 border-bg-200 text-bg-500 dark:border-bg-800">
                  {[
                    'Date',
                    'Type',
                    'Asset',
                    'Particular',
                    'Category',
                    'Amount',
                    'Receipt',
                    ''
                  ].map(column => (
                    <th
                      key={column}
                      className={`py-2 font-medium ${
                        column === 'Particular' && 'text-left'
                      }`}
                    >
                      {column !== '' && t(`table.${toCamelCase(column)}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr
                    key={transaction.id}
                    className="border-b border-bg-200 dark:border-bg-800"
                  >
                    <td className="whitespace-nowrap p-2 text-center">
                      {moment(transaction.date).format('MMM DD, YYYY')}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          {
                            income: 'bg-green-500/20 text-green-500',
                            expenses: 'bg-red-500/20 text-red-500',
                            transfer: 'bg-blue-500/20 text-blue-500'
                          }[transaction.type]
                        }
                      `}
                      >
                        {transaction.type[0].toUpperCase() +
                          transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="inline-flex w-min items-center gap-1 whitespace-nowrap rounded-full bg-bg-200 px-3 py-1 text-sm text-bg-500 dark:bg-bg-800 dark:text-bg-400">
                        <Icon
                          icon={
                            assets.find(asset => asset.id === transaction.asset)
                              ?.icon ?? ''
                          }
                          className="size-4 shrink-0"
                        />
                        {
                          assets.find(asset => asset.id === transaction.asset)
                            ?.name
                        }
                      </span>
                    </td>
                    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                    <td className="min-w-96 p-2">{transaction.particulars}</td>
                    <td className="p-2 text-center">
                      {transaction.category !== '' ? (
                        <span
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
                          style={{
                            backgroundColor:
                              categories.find(
                                category => category.id === transaction.category
                              )?.color + '20',
                            color: categories.find(
                              category => category.id === transaction.category
                            )?.color
                          }}
                        >
                          <Icon
                            icon={
                              categories.find(
                                category => category.id === transaction.category
                              )?.icon ?? ''
                            }
                            className="size-4"
                          />
                          {
                            categories.find(
                              category => category.id === transaction.category
                            )?.name
                          }
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`${
                          {
                            debit: 'text-green-500',
                            credit: 'text-red-500'
                          }[transaction.side]
                        }
                      `}
                      >
                        {transaction.side === 'debit' ? '+' : '-'}
                        {numberToMoney(transaction.amount)}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      {transaction.receipt !== '' ? (
                        <Zoom zoomMargin={100}>
                          <img
                            alt=""
                            src={`${import.meta.env.VITE_API_HOST}/media/${
                              transaction.collectionId
                            }/${transaction.id}/${transaction.receipt}`}
                            className={
                              'mx-auto size-12 rounded-lg bg-bg-200 object-cover dark:bg-bg-800'
                            }
                          />
                        </Zoom>
                      ) : (
                        '-'
                      )}
                    </td>
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
