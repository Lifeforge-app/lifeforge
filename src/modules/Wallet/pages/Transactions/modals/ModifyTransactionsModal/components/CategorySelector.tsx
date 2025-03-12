import { Icon } from '@iconify/react'
import React from 'react'

import {
  ListboxNullOption,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

function CategorySelector({
  category,
  setCategory,
  transactionType
}: {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  transactionType: string
}): React.ReactElement {
  const { categories } = useWalletContext()

  if (categories === 'loading') {
    return <div>Loading...</div>
  }

  if (categories === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      required
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:apps-off'
            }
            style={{
              color: categories.find(l => l.id === category)?.color
            }}
          />
          <span className="-mt-px block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </>
      }
      icon="tabler:apps"
      name="Category"
      namespace="modules.wallet"
      setValue={setCategory}
      type="listbox"
      value={category}
    >
      <ListboxNullOption hasBgColor icon="tabler:apps-off" value={null} />
      {categories
        .filter(e => e.type === transactionType)
        .map(({ name, color, id, icon }, i) => (
          <ListboxOrComboboxOption
            key={i}
            color={color}
            icon={icon}
            text={name}
            value={id}
          />
        ))}
    </ListboxOrComboboxInput>
  )
}

export default CategorySelector
