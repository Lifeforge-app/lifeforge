import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxNullOption'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import { useWalletContext } from '@providers/WalletProvider'

function CategorySelector({
  category,
  setCategory,
  transactionType
}: {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  transactionType: string
}): React.ReactElement {
  const { t } = useTranslation()
  const { categories } = useWalletContext()

  if (categories === 'loading') {
    return <div>Loading...</div>
  }

  if (categories === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      type="listbox"
      name={t('input.category')}
      icon="tabler:apps"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:apps-off'
            }
            style={{
              color: categories.find(l => l.id === category)?.color
            }}
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxNullOption icon="tabler:apps-off" hasBgColor value={null} />
      {categories
        .filter(e => e.type === transactionType)
        .map(({ name, color, id, icon }, i) => (
          <ListboxOrComboboxOption
            key={i}
            text={name}
            icon={icon}
            color={color}
            value={id}
          />
        ))}
    </ListboxOrComboboxInput>
  )
}

export default CategorySelector
