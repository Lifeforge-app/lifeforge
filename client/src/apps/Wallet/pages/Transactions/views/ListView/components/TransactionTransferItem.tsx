import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import type { WalletTransaction } from '../../..'
import ModifyTransactionsModal from '../../../modals/ModifyTransactionsModal'
import ViewReceiptModal from '../../../modals/ViewReceiptModal'
import ViewTransactionModal from '../../../modals/ViewTransactionModal'

function TransactionTransferItem({
  transaction
}: {
  transaction: WalletTransaction
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const { assetsQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const handleViewTransaction = useCallback(() => {
    open(ViewTransactionModal, {
      transaction
    })
  }, [transaction])

  const handleEditTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'update',
      initialData: transaction
    })
  }, [transaction])

  const handleDeleteTransaction = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/transactions',
      data: transaction,
      itemName: 'transaction',
      queryKey: ['wallet', 'transactions'],
      afterDelete: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['wallet', 'categories']
        })
        await queryClient.invalidateQueries({
          queryKey: ['wallet', 'ledgers']
        })
        await queryClient.invalidateQueries({
          queryKey: ['wallet', 'assets']
        })
      }
    })
  }, [transaction])

  const handleViewReceipt = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      open(ViewReceiptModal, {
        src: forgeAPI.media.input({
          collectionId: transaction.collectionId,
          recordId: transaction.id,
          fieldId: transaction.receipt
        }).endpoint
      })
    },
    [transaction]
  )

  if (transaction.type !== 'transfer') {
    return null
  }

  return (
    <div
      className={clsx(
        'flex-between component-bg-with-hover shadow-custom relative flex gap-12 rounded-md p-4'
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
        <Icon className="text-bg-500 size-8" icon="tabler:transfer" />
        <div className="flex w-full min-w-0 flex-col-reverse sm:flex-col">
          <div className="flex w-full min-w-0 items-center gap-2">
            <div className="min-w-0 truncate text-lg font-medium">
              Transfer from{' '}
              {assets.find(asset => asset.id === transaction.from)?.name ??
                'Unknown'}{' '}
              to{' '}
              {assets.find(asset => asset.id === transaction.to)?.name ??
                'Unknown'}
            </div>
            {transaction.receipt !== '' && (
              <button onClick={handleViewReceipt}>
                <Icon className="text-bg-500 size-5" icon="tabler:file-text" />
              </button>
            )}
          </div>
          <div className="text-bg-500 flex items-center gap-2 text-sm font-medium">
            <span className="block sm:hidden">
              {dayjs(transaction.date).format('DD MMM')}
            </span>
            <span className="hidden sm:block">
              {dayjs(transaction.date).format('MMM DD, YYYY')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-lg font-medium">
        <span className="text-lg font-medium text-blue-500">
          {numberToCurrency(transaction.amount)}
        </span>
        <HamburgerMenu>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleEditTransaction}
          />
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

export default TransactionTransferItem
