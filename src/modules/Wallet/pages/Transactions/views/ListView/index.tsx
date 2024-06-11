import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import {
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import { numberToMoney } from '@utils/strings'

function ListView({
  transactions,
  categories,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen
}: {
  transactions: IWalletTransactionEntry[]
  categories: IWalletCategoryEntry[]
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  setModifyModalOpenType: React.Dispatch<'create' | 'update' | null>
  setDeleteTransactionsConfirmationOpen: React.Dispatch<boolean>
}): React.ReactElement {
  return (
    <ul className="flex min-h-0 flex-col divide-y divide-bg-800/70 overflow-y-auto">
      {transactions.map(transaction => (
        <li
          key={transaction.id}
          className="relative flex items-center justify-between gap-8 px-2 py-4"
        >
          <div className="flex w-full min-w-0 items-center gap-2">
            <div
              className="h-12 w-1 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  categories.find(
                    category => category.id === transaction.category
                  )?.color ?? 'transparent'
              }}
            />
            <div className="w-full min-w-0">
              <div className="w-full min-w-0 truncate text-lg font-medium text-bg-100">
                {transaction.particulars}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-bg-500">
                {moment(transaction.date).format('MMM DD, YYYY')}
                <Icon icon="tabler:circle-filled" className="size-1" />
                {transaction.type[0].toUpperCase() + transaction.type.slice(1)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ListView
