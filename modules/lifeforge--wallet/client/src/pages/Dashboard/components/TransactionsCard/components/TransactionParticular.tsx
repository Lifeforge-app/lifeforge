import { Text } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import type { WalletTransaction } from '../../../../Transactions'

function TransactionParticular({
  transaction
}: {
  transaction: WalletTransaction
}) {
  const { assetsQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  return (
    <>
      {transaction.type === 'transfer' ? (
        `Transfer from ${
          assets.find(asset => asset.id === transaction.from)?.name
        } to ${assets.find(asset => asset.id === transaction.to)?.name}`
      ) : (
        <>
          {transaction.particulars}{' '}
          {transaction.location_name && (
            <>
              <Text color="bg-500">@</Text> {transaction.location_name}
            </>
          )}
        </>
      )}
    </>
  )
}

export default TransactionParticular
