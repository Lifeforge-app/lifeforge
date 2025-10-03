import clsx from 'clsx'

import numberToCurrency from '../../../../../utils/numberToCurrency'
import type { WalletTransaction } from '../../../../Transactions'

function TransactionAmount({
  type,
  amount
}: {
  type: WalletTransaction['type']
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
