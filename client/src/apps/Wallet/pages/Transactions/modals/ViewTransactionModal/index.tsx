import { ModalHeader } from 'lifeforge-ui'

import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

import Details from './components/Details'
import Header from './components/Header'

function ViewTransactionModal({
  data: { transaction },
  onClose
}: {
  data: {
    transaction: IWalletTransaction
  }
  onClose: () => void
}) {
  return (
    <div className="min-w-[30vw] space-y-4">
      <ModalHeader
        icon="tabler:eye"
        namespace="apps.wallet"
        title="transactions.view"
        onClose={onClose}
      />
      <Header transaction={transaction} />
      <Details transaction={transaction} />
    </div>
  )
}

export default ViewTransactionModal
