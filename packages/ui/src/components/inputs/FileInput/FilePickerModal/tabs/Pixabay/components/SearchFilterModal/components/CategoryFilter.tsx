import { ListboxInput, ListboxOption } from '@/components/inputs'
import { Icon, Text } from '@/components/primitives'

import type {
  IPixabaySearchFilter,
  PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { CATEGORIES } from '../constants/filterOptions'

interface CategoryFilterProps {
  category: IPixabaySearchFilter['category']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

export function CategoryFilter({
  category,
  updateFilters
}: CategoryFilterProps) {
  return (
    <ListboxInput
      icon="tabler:category"
      label="imagePicker.inputs.imageCategory"
      namespace="common.modals"
      renderContent={() => (
        <>
          <Icon
            icon={CATEGORIES.find(l => l.id === category)?.icon ?? ''}
            style={{ height: '1.25rem', width: '1.25rem' }}
          />
          <Text
            truncate
            as="span"
            style={{ display: 'block', marginTop: '-1px' }}
          >
            {CATEGORIES.find(l => l.id === category)?.name ?? 'None'}
          </Text>
        </>
      )}
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
