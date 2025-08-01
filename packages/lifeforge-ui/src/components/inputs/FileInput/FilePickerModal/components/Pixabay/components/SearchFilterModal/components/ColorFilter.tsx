import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { COLORS } from '../constants/filterOptions'

interface ColorFilterProps {
  colors: IPixabaySearchFilter['colors']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function ColorFilter({ colors, updateFilters }: ColorFilterProps) {
  return (
    <ListboxInput
      buttonContent={
        <>
          <div
            className="border-bg-200 dark:border-bg-700 size-3 rounded-full border"
            style={{
              backgroundColor: COLORS.find(l => l.id === colors)?.color
            }}
          />
          <span className="-mt-px block truncate">
            {COLORS.find(l => l.id === colors)?.name ?? 'None'}
          </span>
        </>
      }
      icon="tabler:color-swatch"
      name="Image Color"
      namespace="common.modals"
      setValue={value => {
        updateFilters({ type: 'SET_COLORS', payload: value })
      }}
      tKey="imagePicker"
      value={colors}
    >
      {COLORS.map(({ name, color, id }, i) => (
        <ListboxOption key={i} color={color} text={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export default ColorFilter
