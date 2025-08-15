import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import { Icon } from '@iconify/react'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { CATEGORIES } from '../constants/filterOptions'

interface CategoryFilterProps {
  category: IPixabaySearchFilter['category']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function CategoryFilter({ category, updateFilters }: CategoryFilterProps) {
  return (
    <ListboxInput
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={CATEGORIES.find(l => l.id === category)?.icon ?? ''}
          />
          <span className="-mt-px block truncate">
            {CATEGORIES.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </>
      }
      icon="tabler:category"
      label="imagePicker.inputs.imageCategory"
      namespace="common.modals"
      setValue={value => {
        updateFilters({ type: 'SET_CATEGORY', payload: value })
      }}
      value={category}
    >
      {CATEGORIES.map(({ name, icon, id }, i) => (
        <ListboxOption key={i} icon={icon} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default CategoryFilter
