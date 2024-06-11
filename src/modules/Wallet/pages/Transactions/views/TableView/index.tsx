import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import {
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletLedgerEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import { numberToMoney, toCamelCase } from '@utils/strings'

function TableView({
  transactions,
  ledgers,
  assets,
  categories,
  visibleColumn,
  setModifyModalOpenType,
  setSelectedData,
  setDeleteTransactionsConfirmationOpen
}: {
  transactions: IWalletTransactionEntry[]
  ledgers: IWalletLedgerEntry[]
  assets: IWalletAssetEntry[]
  categories: IWalletCategoryEntry[]
  visibleColumn: string[]
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  setDeleteTransactionsConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  const { t } = useTranslation()

  return (
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
              (visibleColumn.includes(column) || column === '') && (
                <th
                  key={column}
                  className={`py-2 font-medium ${
                    column === 'Particular' && 'text-left'
                  }`}
                >
                  {column !== '' && t(`table.${toCamelCase(column)}`)}
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
                        ledgers.find(ledger => ledger.id === transaction.ledger)
                          ?.color + '20',
                      color: ledgers.find(
                        ledger => ledger.id === transaction.ledger
                      )?.color
                    }}
                  >
                    <Icon
                      icon={
                        ledgers.find(
                          ledgers => ledgers.id === transaction.ledger
                        )?.icon ?? ''
                      }
                      className="size-4"
                    />
                    {
                      ledgers.find(ledger => ledger.id === transaction.ledger)
                        ?.name
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
                      assets.find(asset => asset.id === transaction.asset)
                        ?.icon ?? ''
                    }
                    className="size-4 shrink-0"
                  />
                  {assets.find(asset => asset.id === transaction.asset)?.name}
                </span>
              </td>
            )}
            {visibleColumn.includes('Particular') && (
              <td className="min-w-96 p-2">{transaction.particulars}</td>
            )}
            {visibleColumn.includes('Category') && (
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
  )
}

export default TableView
