import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption } from '@components/inputs'
import { Text } from '@components/primitives'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { IMAGE_TYPES } from '../constants/filterOptions'

interface ImageTypeFilterProps {
  imageType: IPixabaySearchFilter['imageType']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

export function ImageTypeFilter({ imageType, updateFilters }: ImageTypeFilterProps) {
  const { t } = useTranslation('common.modals')

  return (
    <ListboxInput
      buttonContent={
        <>
          <Icon
            icon={IMAGE_TYPES.find(l => l.id === imageType)?.icon ?? ''}
            style={{ height: '1.25rem', width: '1.25rem' }}
          />
          <Text
            as="span"
            style={{ display: 'block', marginTop: '-1px' }}
            truncate
          >
            {t(
              `imagePicker.imageType.${IMAGE_TYPES.find(l => l.id === imageType)?.id}`
            )}
          </Text>
        </>
      }
      icon="tabler:list"
      label="imagePicker.inputs.imageType"
      namespace="common.modals"
      value={imageType}
      onChange={value => {
        updateFilters({ type: 'SET_IMAGE_TYPE', payload: value })
      }}
    >
      {IMAGE_TYPES.map(({ icon, id }, i) => (
        <ListboxOption
          key={i}
          icon={icon}
          label={t(`imagePicker.imageType.${id}`)}
          value={id}
        />
      ))}
    </ListboxInput>
  )
}

