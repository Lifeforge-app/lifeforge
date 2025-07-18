import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import {
  IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '@components/inputs/ImageAndFileInput/FileAndImagePickerModal/components/Pixabay/typescript/pixabay_interfaces'
import { Icon } from '@iconify/react'

import { CATEGORIES } from '../constants/filterOptions'

interface CategoryFilterProps {
  category: IPixabaySearchFilter['category']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function CategoryFilter({ category, updateFilters }: CategoryFilterProps) {
  return (
    <ListboxOrComboboxInput
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
      name="image Category"
      namespace="common.modals"
      setValue={value => {
        updateFilters({ type: 'SET_CATEGORY', payload: value })
      }}
      tKey="imagePicker"
      type="listbox"
      value={category}
    >
      {CATEGORIES.map(({ name, icon, id }, i) => (
        <ListboxOrComboboxOption key={i} icon={icon} text={name} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default CategoryFilter
