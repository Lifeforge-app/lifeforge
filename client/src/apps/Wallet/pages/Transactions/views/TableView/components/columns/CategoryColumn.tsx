import { Icon } from '@iconify/react'
import { Link } from 'react-router'

import { type IWalletCategory } from '../../../../../../interfaces/wallet_interfaces'

function CategoryColumn({
  category,
  categories
}: {
  category: string
  categories: IWalletCategory[]
}) {
  return (
    <td className="p-2 text-center">
      {category !== '' ? (
        <Link
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap"
          style={{
            backgroundColor:
              categories.find(c => c.id === category)?.color + '20',
            color: categories.find(c => c.id === category)?.color
          }}
          to={`/wallet/transactions?category=${category}`}
        >
          <Icon
            className="size-4"
            icon={categories.find(c => c.id === category)?.icon ?? ''}
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
