import ListboxInput from '@components/inputs/ListboxInput'
import ListboxOption from '@components/inputs/ListboxInput/components/ListboxOption'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

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
      label="image type"
      namespace="common.modals"
      setValue={value => {
        updateFilters({ type: 'SET_IMAGE_TYPE', payload: value })
      }}
      tKey="imagePicker"
      value={imageType}
    >
      {IMAGE_TYPES.map(({ icon, id }, i) => (
        <ListboxOption
          key={i}
          icon={icon}
          text={t(`imagePicker.imageType.${id}`)}
          value={id}
        />
      ))}
    </ListboxInput>
  )
}

export default ImageTypeFilter
