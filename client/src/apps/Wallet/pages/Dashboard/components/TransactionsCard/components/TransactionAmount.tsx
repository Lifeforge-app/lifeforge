import clsx from 'clsx'

import type { IWalletTransaction } from '@apps/Wallet/pages/Transactions'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function TransactionAmount({
  type,
  amount
}: {
  type: IWalletTransaction['type']
  amount: number
}) {
  return (
    <>
      <span
        className={clsx({
          'text-green-500': type === 'income',
          'text-red-500': type === 'expenses',
          'text-blue-500': type === 'transfer'
        })}
      >
        {
          {
            income: '+',
            expenses: '-',
            transfer: ''
          }[type]
        }
        {numberToCurrency(amount)}
      </span>
    </>
  )
}

export default TransactionAmount
