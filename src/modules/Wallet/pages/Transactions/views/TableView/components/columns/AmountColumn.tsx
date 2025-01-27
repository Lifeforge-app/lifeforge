import React from 'react'
import { numberToMoney } from '@utils/strings'

function AmountColumn({
  side,
  amount
}: {
  side: 'debit' | 'credit'
  amount: number
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      <span
        className={`${
          {
            debit: 'text-green-500',
            credit: 'text-red-500'
          }[side]
        }`}
      >
        {side === 'debit' ? '+' : '-'}
        {numberToMoney(amount)}
      </span>
    </td>
  )
}

export default AmountColumn
