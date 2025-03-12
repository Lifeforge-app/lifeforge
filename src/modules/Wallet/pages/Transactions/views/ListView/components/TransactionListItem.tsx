import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import { Tooltip } from 'react-tooltip'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

import { type IWalletTransaction } from '../../../../../interfaces/wallet_interfaces'

function TransactionListItem({
  transaction,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen,
  setReceiptModalOpen,
  setReceiptToView,
  setSelectedData
}: {
  transaction: IWalletTransaction
  setModifyModalOpenType: React.Dispatch<'create' | 'update' | null>
  setDeleteTransactionsConfirmationOpen: React.Dispatch<boolean>
  setReceiptModalOpen: React.Dispatch<boolean>
  setReceiptToView: React.Dispatch<string>
  setSelectedData: React.Dispatch<IWalletTransaction | null>
}) {
  const { categories, ledgers, assets } = useWalletContext()

  if (
    typeof assets === 'string' ||
    typeof ledgers === 'string' ||
    typeof categories === 'string'
  ) {
    return <></>
  }

  return (
    <div className="flex-between border-bg-200 dark:border-bg-800/50 relative flex gap-12 border-b py-4 pl-2">
      <div className="flex w-full min-w-0 items-center gap-2 [@media(min-width:400px)]:gap-4">
        <div
          className="h-12 w-1 shrink-0 rounded-full"
          style={{
            backgroundColor:
              categories.find(category => category.id === transaction.category)
                ?.color ?? 'transparent'
          }}
        />
        <Icon
          className="text-bg-500 size-8"
          icon={
            assets.find(asset => asset.id === transaction.asset)?.icon ?? ''
          }
        />
        <div className="flex w-full min-w-0 flex-col-reverse sm:flex-col">
          <div className="flex w-full min-w-0 items-center gap-2">
            <div className="min-w-0 truncate text-lg font-medium">
              {transaction.particulars}{' '}
              {transaction.location !== '' && (
                <>
                  <span className="text-bg-500">@</span>{' '}
                  {`${transaction.location.split(',')[0]}`}
                </>
              )}
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
                <Icon className="text-bg-500 size-5" icon="tabler:file-text" />
              </button>
            )}
            {transaction.location !== '' && (
              <>
                <span data-tooltip-id={`tooltip-location-${transaction.id}`}>
                  <Icon className="text-bg-500 size-5" icon="tabler:map-pin" />
                </span>
                <Tooltip
                  className="bg-bg-50 text-bg-800 shadow-custom dark:bg-bg-800 dark:text-bg-50 z-9999 rounded-md! p-4! text-base!"
                  classNameArrow="size-6!"
                  id={`tooltip-location-${transaction.id}`}
                  opacity={1}
                  place="top-start"
                  positionStrategy="fixed"
                >
                  <div className="relative z-10 max-w-sm">
                    {transaction.location}
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div className="text-bg-500 flex items-center gap-2 text-sm font-medium">
            <span className="block sm:hidden">
              {moment(transaction.date).format('DD MMM')}
            </span>
            <span className="hidden sm:block">
              {moment(transaction.date).format('MMM DD, YYYY')}
            </span>
            <Icon className="size-1" icon="tabler:circle-filled" />
            <div className="flex items-center gap-1">
              <Icon
                className={clsx(
                  'size-4',
                  {
                    income: 'text-green-500',
                    expenses: 'text-red-500',
                    transfer: 'text-blue-500'
                  }[transaction.type as 'income' | 'expenses' | 'transfer']
                )}
                icon={
                  {
                    income: 'tabler:login-2',
                    expenses: 'tabler:logout',
                    transfer: 'tabler:transfer'
                  }[transaction.type as 'income' | 'expenses' | 'transfer']
                }
              />
              <span className="hidden md:block">
                {transaction.type[0].toUpperCase() + transaction.type.slice(1)}
              </span>
            </div>
            {transaction.ledger !== '' && (
              <>
                <Icon className="size-1" icon="tabler:circle-filled" />
                <div className="flex items-center gap-1">
                  <Icon
                    className="size-4"
                    icon={
                      ledgers.find(ledger => ledger.id === transaction.ledger)
                        ?.icon ?? ''
                    }
                    style={{
                      color:
                        ledgers.find(ledger => ledger.id === transaction.ledger)
                          ?.color ?? 'white'
                    }}
                  />
                  <span className="hidden md:block">
                    {ledgers.find(ledger => ledger.id === transaction.ledger)
                      ?.name ?? 'Unknown'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-lg font-medium">
        <span
          className={clsx('text-lg font-medium', {
            'text-green-500': transaction.side === 'debit',
            'text-red-500': transaction.side === 'credit'
          })}
        >
          {transaction.side === 'debit' ? '+' : '-'}
          {transaction.amount.toFixed(2)}
        </span>
        <HamburgerMenu>
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
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => {
              setSelectedData(transaction)
              setDeleteTransactionsConfirmationOpen(true)
            }}
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default TransactionListItem
