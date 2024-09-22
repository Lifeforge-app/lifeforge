import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'

function CategorySelector({
  categories,
  category,
  setCategory
}: {
  categories: ICalendarCategory[] | 'loading' | 'error'
  category: string
  setCategory: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  if (typeof categories === 'string') return <></>

  return (
    <ListboxInput
      name={t('input.eventCategory')}
      icon="tabler:list"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:list'
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
      <ListboxNullOption icon="tabler:apps-off" hasBgColor />
      {categories.map(({ name, color, icon, id }, i) => (
        <ListboxOption
          key={i}
          value={id}
          text={name}
          icon={icon}
          color={color}
        />
      ))}
    </ListboxInput>
  )
}

export default CategorySelector
