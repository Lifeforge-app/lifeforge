import React from 'react'
import { Link } from 'react-router'

function TypeColumn({
  type
}: {
  type: 'income' | 'expenses' | 'transfer'
}): React.ReactElement {
  return (
    <td className="p-4 text-center">
      <Link
        className={`rounded-full px-3 py-1 text-sm ${
          {
            income: 'bg-green-500/20 text-green-500',
            expenses: 'bg-red-500/20 text-red-500',
            transfer: 'bg-blue-500/20 text-blue-500'
          }[type]
        }`}
        to={`/wallet/transactions?type=${type}`}
      >
        {type[0].toUpperCase() + type.slice(1)}
      </Link>
    </td>
  )
}

export default TypeColumn
