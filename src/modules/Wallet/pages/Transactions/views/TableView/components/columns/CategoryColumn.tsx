import { Icon } from '@iconify/react'
import React from 'react'
import { type IWalletCategoryEntry } from '@interfaces/wallet_interfaces'

function CategoryColumn({
  category,
  categories
}: {
  category: string
  categories: IWalletCategoryEntry[]
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      {category !== '' ? (
        <span
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
        </span>
      ) : (
        '-'
      )}
    </td>
  )
}

export default CategoryColumn
