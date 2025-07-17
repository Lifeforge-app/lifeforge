import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import {
  IPixabaySearchFilter,
  type PixabaySearchFilterAction
} from '@interfaces/pixabay_interfaces'

import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'

import { IMAGE_TYPES } from '../constants/filterOptions'

interface ImageTypeFilterProps {
  imageType: IPixabaySearchFilter['imageType']
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function ImageTypeFilter({ imageType, updateFilters }: ImageTypeFilterProps) {
  const { t } = useTranslation('common.modals')

  return (
    <ListboxOrComboboxInput
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
      name="image type"
      namespace="common.modals"
      setValue={value => {
        updateFilters({ type: 'SET_IMAGE_TYPE', payload: value })
      }}
      tKey="imagePicker"
      type="listbox"
      value={imageType}
    >
      {IMAGE_TYPES.map(({ icon, id }, i) => (
        <ListboxOrComboboxOption
          key={i}
          icon={icon}
          text={t(`imagePicker.imageType.${id}`)}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default ImageTypeFilter
