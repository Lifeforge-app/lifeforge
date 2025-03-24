import clsx from 'clsx'

import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function AmountColumn({
  side,
  amount
}: {
  side: 'debit' | 'credit'
  amount: number
}) {
  return (
    <td className="p-2 text-center">
      <span
        className={clsx({
          'text-green-500': side === 'debit',
          'text-red-500': side === 'credit'
        })}
      >
        {side === 'debit' ? '+' : '-'}
        {numberToCurrency(amount)}
      </span>
    </td>
  )
}

export default AmountColumn
