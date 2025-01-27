import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IWalletCategory } from '@interfaces/wallet_interfaces'

function CategoryColumn({
  category,
  categories
}: {
  category: string
  categories: IWalletCategory[]
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      {category !== '' ? (
        <Link
          to={`/wallet/transactions?category=${category}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm"
          style={{
            backgroundColor:
              categories.find(c => c.id === category)?.color + '20',
            color: categories.find(c => c.id === category)?.color
          }}
        >
          <Icon
            icon={categories.find(c => c.id === category)?.icon ?? ''}
            className="size-4"
          />
          {categories.find(c => c.id === category)?.name}
        </Link>
      ) : (
        '-'
      )}
    </td>
  )
}

export default CategoryColumn
