import { useWalletData } from '@apps/03.Finance/Wallet/hooks/useWalletData'
import type { WalletTransaction } from '@apps/03.Finance/Wallet/pages/Transactions'

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
