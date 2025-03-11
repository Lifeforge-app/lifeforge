import { numberToMoney } from '@utils/strings'
import clsx from 'clsx'
import React from 'react'

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
        className={clsx({
          'text-green-500': side === 'debit',
          'text-red-500': side === 'credit'
        })}
      >
        {side === 'debit' ? '+' : '-'}
        {numberToMoney(amount)}
      </span>
    </td>
  )
}

export default AmountColumn
