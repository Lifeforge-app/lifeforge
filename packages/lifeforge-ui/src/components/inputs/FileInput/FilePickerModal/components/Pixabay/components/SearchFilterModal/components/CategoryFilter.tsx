import { Icon } from '@iconify/react'

import { ListboxInput, ListboxOption } from '@components/inputs'
import { Text } from '@components/primitives'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { CATEGORIES } from '../constants/filterOptions'

interface CategoryFilterProps {
  category: IPixabaySearchFilter['category']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

export function CategoryFilter({ category, updateFilters }: CategoryFilterProps) {
  return (
    <ListboxInput
      buttonContent={
        <>
          <Icon
            icon={CATEGORIES.find(l => l.id === category)?.icon ?? ''}
            style={{ height: '1.25rem', width: '1.25rem' }}
          />
          <Text
            as="span"
            style={{ display: 'block', marginTop: '-1px' }}
            truncate
          >
            {CATEGORIES.find(l => l.id === category)?.name ?? 'None'}
          </Text>
        </>
      }
      icon="tabler:category"
      label="imagePicker.inputs.imageCategory"
      namespace="common.modals"
      value={category}
      onChange={value => {
        updateFilters({ type: 'SET_CATEGORY', payload: value })
      }}
    >
      {CATEGORIES.map(({ name, icon, id }, i) => (
        <ListboxOption key={i} icon={icon} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

