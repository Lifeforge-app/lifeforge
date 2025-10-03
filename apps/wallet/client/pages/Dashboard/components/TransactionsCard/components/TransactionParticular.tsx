import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'

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
              <span className="text-bg-500">@</span> {transaction.location_name}
            </>
          )}
        </>
      )}
    </>
  )
}

export default TransactionParticular
