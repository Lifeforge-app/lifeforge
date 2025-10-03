import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import dayjs from 'dayjs'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'
import numberToCurrency from '@apps/03.Finance/wallet/utils/numberToCurrency'

import type { WalletTransaction } from '../../..'
import ViewReceiptModal from '../../../modals/ViewReceiptModal'

function TransactionTransferItem({
  transaction
}: {
  transaction: WalletTransaction
}) {
  const open = useModalStore(state => state.open)

  const { assetsQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

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
    <div className="flex-between w-full min-w-0 gap-12">
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
      <span className="text-lg font-medium text-blue-500">
        {numberToCurrency(transaction.amount)}
      </span>
    </div>
  )
}

export default TransactionTransferItem
