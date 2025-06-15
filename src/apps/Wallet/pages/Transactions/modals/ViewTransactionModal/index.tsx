import { ModalHeader } from '@lifeforge/ui'

import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

function ViewTransactionModal({
  data: { transaction },
  onClose
}: {
  data: {
    transaction: IWalletTransaction
  }
  onClose: () => void
}) {
  //TODO
  return (
    <div className="min-w-[30vw] space-y-4">
      <ModalHeader
        icon="tabler:eye"
        title="View Transaction"
        onClose={onClose}
      />
      <pre>
        <code className="break-words whitespace-pre-wrap">
          {JSON.stringify(transaction, null, 2)}
        </code>
      </pre>
    </div>
  )
}

export default ViewTransactionModal
