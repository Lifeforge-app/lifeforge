import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'

import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import useComponentBg from '@hooks/useComponentBg'

import { type IWalletTransaction } from '../../../../../interfaces/wallet_interfaces'
import ModifyTransactionsModal from '../../../modals/ModifyTransactionsModal'
import ViewTransactionModal from '../../../modals/ViewTransactionModal'
import ViewReceiptModal from './ViewReceiptModal'

function TransactionListItem({
  transaction
}: {
  transaction: IWalletTransaction
}) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const { componentBgWithHover } = useComponentBg()

  const { categoriesQuery, ledgersQuery, assetsQuery } = useWalletData()
  const categories = categoriesQuery.data ?? []
  const ledgers = ledgersQuery.data ?? []
  const assets = assetsQuery.data ?? []

  const handleViewTransaction = useCallback(() => {
    open(ViewTransactionModal, {
      transaction
    })
  }, [transaction])

  const handleEditTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'update',
      existedData: transaction
    })
  }, [transaction])

  const handleDeleteTransaction = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/transactions',
      data: transaction,
      itemName: 'transaction',
      queryKey: ['wallet', 'transactions'],
      updateDataList: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
        queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
        queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
      }
    })
  }, [transaction])

  const handleViewReceipt = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      open(ViewReceiptModal, {
        src: `${import.meta.env.VITE_API_HOST}/media/${
          transaction.collectionId
        }/${transaction.id}/${transaction.receipt}`
      })
    },
    [transaction]
  )

  return (
    <div
      className={clsx(
        'flex-between relative flex gap-12 p-4',
        componentBgWithHover
      )}
      role="button"
      tabIndex={0}
      onClick={handleViewTransaction}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleViewTransaction()
        }
      }}
    >
      <div className="flex w-full min-w-0 items-center gap-2 [@media(min-width:400px)]:gap-3">
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
              <button onClick={handleViewReceipt}>
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
              {dayjs(transaction.date).format('DD MMM')}
            </span>
            <span className="hidden sm:block">
              {dayjs(transaction.date).format('MMM DD, YYYY')}
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
      <div className="flex items-center gap-3 text-lg font-medium">
        <span
          className={clsx('text-lg font-medium', {
            'text-green-500': transaction.side === 'debit',
            'text-red-500': transaction.side === 'credit'
          })}
        >
          {transaction.side === 'debit' ? '+' : '-'}
          {numberToCurrency(transaction.amount)}
        </span>
        <HamburgerMenu>
          {transaction.type !== 'transfer' && (
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={handleEditTransaction}
            />
          )}
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteTransaction}
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default TransactionListItem
