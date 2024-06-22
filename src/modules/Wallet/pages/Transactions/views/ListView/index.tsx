import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import Scrollbar from '@components/Scrollbar'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'
import ReceiptModal from './components/ReceiptModal'

function ListView({
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen,
  setReceiptModalOpen,
  setReceiptToView
}: {
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  setModifyModalOpenType: React.Dispatch<'create' | 'update' | null>
  setDeleteTransactionsConfirmationOpen: React.Dispatch<boolean>
  setReceiptModalOpen: React.Dispatch<boolean>
  setReceiptToView: React.Dispatch<string>
}): React.ReactElement {
  const {
    ledgers,
    assets,
    categories,
    filteredTransactions: transactions
  } = useWalletContext()

  if (
    typeof assets === 'string' ||
    typeof ledgers === 'string' ||
    typeof categories === 'string'
  ) {
    return <></>
  }

  return (
    <>
      <Scrollbar>
        <ul className="flex min-h-full flex-col divide-y divide-bg-200 pb-8 dark:divide-bg-800/70">
          {transactions.map(transaction => (
            <li
              key={transaction.id}
              className="relative flex items-center justify-between gap-12 p-4 pl-2"
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
                    assets.find(asset => asset.id === transaction.asset)
                      ?.icon ?? ''
                  }
                  className="size-8 text-bg-500"
                />
                <div className="w-full min-w-0">
                  <div className="flex w-full min-w-0 items-center gap-2">
                    <div className="min-w-0 truncate text-lg font-medium">
                      {transaction.particulars}
                    </div>
                    {transaction.receipt !== '' && (
                      <button
                        onClick={() => {
                          setReceiptToView(
                            `${import.meta.env.VITE_API_HOST}/media/${
                              transaction.collectionId
                            }/${transaction.id}/${transaction.receipt}`
                          )
                          setReceiptModalOpen(true)
                        }}
                      >
                        <Icon
                          icon="tabler:file-text"
                          className="size-5 text-bg-500"
                        />
                      </button>
                    )}
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
                          }[
                            transaction.type as
                              | 'income'
                              | 'expenses'
                              | 'transfer'
                          ]
                        }
                        className={`size-4 ${
                          {
                            income: 'text-green-500',
                            expenses: 'text-red-500',
                            transfer: 'text-blue-500'
                          }[
                            transaction.type as
                              | 'income'
                              | 'expenses'
                              | 'transfer'
                          ]
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
      </Scrollbar>
    </>
  )
}

export default ListView
