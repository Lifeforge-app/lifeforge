import { ListboxInput, ListboxOption } from '@/components/inputs'
import { Bordered, Text } from '@/components/primitives'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { COLORS } from '../constants/filterOptions'

interface ColorFilterProps {
  colors: IPixabaySearchFilter['colors']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

export function ColorFilter({ colors, updateFilters }: ColorFilterProps) {
  return (
    <ListboxInput
      buttonContent={
        <>
          <Bordered
            asChild
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            r="full"
            style={{
              backgroundColor: COLORS.find(l => l.id === colors)?.color,
              height: '0.75rem',
              width: '0.75rem'
            }}
          >
            <div />
          </Bordered>
          <Text
            as="span"
            style={{ display: 'block', marginTop: '-1px' }}
            truncate
          >
            {COLORS.find(l => l.id === colors)?.name ?? 'None'}
          </Text>
        </>
      }
      icon="tabler:color-swatch"
      label="imagePicker.inputs.imageColor"
      namespace="common.modals"
      value={colors}
      onChange={value => {
        updateFilters({ type: 'SET_COLORS', payload: value })
      }}
    >
      {COLORS.map(({ name, color, id }, i) => (
        <ListboxOption key={i} color={color} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}
