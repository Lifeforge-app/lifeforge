import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import {
  type IWalletLedgerEntry,
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

function ListView({
  transactions,
  categories,
  assets,
  ledgers,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen
}: {
  transactions: IWalletTransactionEntry[]
  categories: IWalletCategoryEntry[]
  assets: IWalletAssetEntry[]
  ledgers: IWalletLedgerEntry[]
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
          <div className="flex w-full min-w-0 items-center gap-2 [@media(min-width:400px)]:gap-4">
            <div
              className="h-12 w-1 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  categories.find(
                    category => category.id === transaction.category
                  )?.color ?? 'transparent'
              }}
            />
            <Icon
              icon={
                assets.find(asset => asset.id === transaction.asset)?.icon ?? ''
              }
              className="size-8 text-bg-500"
            />
            <div className="w-full min-w-0">
              <div className="w-full min-w-0 truncate text-lg font-medium text-bg-100">
                {transaction.particulars}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-bg-500">
                {moment(transaction.date).format('MMM DD, YYYY')}
                <Icon icon="tabler:circle-filled" className="size-1" />
                <div className="flex items-center gap-1">
                  <Icon
                    icon={
                      {
                        income: 'tabler:login-2',
                        expenses: 'tabler:logout',
                        transfer: 'tabler:transfer'
                      }[transaction.type as 'income' | 'expenses' | 'transfer']
                    }
                    className={`size-4 ${
                      {
                        income: 'text-green-500',
                        expenses: 'text-red-500',
                        transfer: 'text-blue-500'
                      }[transaction.type as 'income' | 'expenses' | 'transfer']
                    }`}
                  />
                  <span className="hidden md:block">
                    {transaction.type[0].toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                </div>
                {transaction.ledger !== '' && (
                  <>
                    <Icon icon="tabler:circle-filled" className="size-1" />
                    <div className="flex items-center gap-1">
                      <Icon
                        icon={
                          ledgers.find(
                            ledger => ledger.id === transaction.ledger
                          )?.icon ?? ''
                        }
                        style={{
                          color:
                            ledgers.find(
                              ledger => ledger.id === transaction.ledger
                            )?.color ?? 'white'
                        }}
                        className="size-4"
                      />
                      <span className="hidden md:block">
                        {ledgers.find(
                          ledger => ledger.id === transaction.ledger
                        )?.name ?? 'Unknown'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-lg font-medium">
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
