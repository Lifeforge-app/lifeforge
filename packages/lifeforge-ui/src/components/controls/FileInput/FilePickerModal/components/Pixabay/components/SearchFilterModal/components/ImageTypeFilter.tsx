import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption } from '@components/controls'

import {
  type IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '../../../typescript/pixabay_interfaces'
import { IMAGE_TYPES } from '../constants/filterOptions'

interface ImageTypeFilterProps {
  imageType: IPixabaySearchFilter['imageType']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function ImageTypeFilter({ imageType, updateFilters }: ImageTypeFilterProps) {
  const { t } = useTranslation('common.modals')

  return (
    <ListboxInput
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={IMAGE_TYPES.find(l => l.id === imageType)?.icon ?? ''}
          />
          <span className="-mt-px block truncate">
            {t(
              `imagePicker.imageType.${IMAGE_TYPES.find(l => l.id === imageType)?.id}`
            )}
          </span>
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

export default ImageTypeFilter
