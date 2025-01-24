import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { Tooltip } from 'react-tooltip'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

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
}): React.ReactElement {
  const { categories, ledgers, assets } = useWalletContext()

  if (
    typeof assets === 'string' ||
    typeof ledgers === 'string' ||
    typeof categories === 'string'
  ) {
    return <></>
  }

  return (
    <div className="flex-between relative flex gap-12 border-b border-bg-200 py-4 pl-2 dark:border-bg-800/50">
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
          icon={
            assets.find(asset => asset.id === transaction.asset)?.icon ?? ''
          }
          className="size-8 text-bg-500"
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
                <Icon icon="tabler:file-text" className="size-5 text-bg-500" />
              </button>
            )}
            {transaction.location !== '' && (
              <>
                <a data-tooltip-id={`tooltip-location-${transaction.id}`}>
                  <Icon icon="tabler:map-pin" className="size-5 text-bg-500" />
                </a>
                <Tooltip
                  id={`tooltip-location-${transaction.id}`}
                  className="z-[9999] !rounded-md bg-bg-50 !p-4 !text-base text-bg-800 shadow-custom dark:bg-bg-800 dark:text-bg-50"
                  classNameArrow="!size-6"
                  place="top-start"
                  positionStrategy="fixed"
                  opacity={1}
                >
                  <div className="relative z-10 max-w-sm">
                    {transaction.location}
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-bg-500">
            <span className="block sm:hidden">
              {moment(transaction.date).format('DD MMM')}
            </span>
            <span className="hidden sm:block">
              {moment(transaction.date).format('MMM DD, YYYY')}
            </span>
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
                {transaction.type[0].toUpperCase() + transaction.type.slice(1)}
              </span>
            </div>
            {transaction.ledger !== '' && (
              <>
                <Icon icon="tabler:circle-filled" className="size-1" />
                <div className="flex items-center gap-1">
                  <Icon
                    icon={
                      ledgers.find(ledger => ledger.id === transaction.ledger)
                        ?.icon ?? ''
                    }
                    style={{
                      color:
                        ledgers.find(ledger => ledger.id === transaction.ledger)
                          ?.color ?? 'white'
                    }}
                    className="size-4"
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
    </div>
  )
}

export default TransactionListItem
