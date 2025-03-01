import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'

import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import {
  type PixabaySearchFilterAction,
  type IPixabaySearchFilter
} from '@interfaces/pixabay_interfaces'

const IMAGE_TYPES = [
  { id: 'all', icon: 'tabler:category' },
  { id: 'photo', icon: 'tabler:photo' },
  { id: 'illustration', icon: 'tabler:brush' },
  { id: 'vector', icon: 'tabler:vector' }
]

const CATEGORIES = [
  { name: 'None', id: '', icon: 'tabler:circle' },
  { name: 'Backgrounds', id: 'backgrounds', icon: 'tabler:background' },
  { name: 'Fashion', id: 'fashion', icon: 'tabler:shirt' },
  { name: 'Nature', id: 'nature', icon: 'tabler:leaf' },
  { name: 'Science', id: 'science', icon: 'tabler:flask' },
  { name: 'Education', id: 'education', icon: 'tabler:book' },
  { name: 'Feelings', id: 'feelings', icon: 'tabler:mood-smile' },
  { name: 'Health', id: 'health', icon: 'tabler:heart' },
  { name: 'People', id: 'people', icon: 'tabler:users' },
  { name: 'Religion', id: 'religion', icon: 'tabler:cross' },
  { name: 'Places', id: 'places', icon: 'tabler:map' },
  { name: 'Animals', id: 'animals', icon: 'tabler:dog' },
  { name: 'Industry', id: 'industry', icon: 'tabler:tools' },
  { name: 'Computer', id: 'computer', icon: 'tabler:cpu' },
  { name: 'Food', id: 'food', icon: 'tabler:burger' },
  { name: 'Sports', id: 'sports', icon: 'tabler:ball-basketball' },
  { name: 'Transportation', id: 'transportation', icon: 'tabler:car' },
  { name: 'Travel', id: 'travel', icon: 'tabler:plane' },
  { name: 'Buildings', id: 'buildings', icon: 'tabler:building' },
  { name: 'Business', id: 'business', icon: 'tabler:briefcase' },
  { name: 'Music', id: 'music', icon: 'tabler:music' }
]

const COLORS = [
  { name: 'None', id: '', color: 'transparent' },
  { name: 'Grayscale', id: 'grayscale', color: 'gray' },
  { name: 'Transparent', id: 'transparent', color: 'transparent' },
  { name: 'Red', id: 'red', color: 'red' },
  { name: 'Orange', id: 'orange', color: 'orange' },
  { name: 'Yellow', id: 'yellow', color: 'yellow' },
  { name: 'Green', id: 'green', color: 'green' },
  { name: 'Turquoise', id: 'turquoise', color: 'turquoise' },
  { name: 'Blue', id: 'blue', color: 'blue' },
  { name: 'Lilac', id: 'lilac', color: '#C95EFB' },
  { name: 'Pink', id: 'pink', color: 'pink' },
  { name: 'White', id: 'white', color: 'white' },
  { name: 'Gray', id: 'gray', color: 'gray' },
  { name: 'Black', id: 'black', color: 'black' },
  { name: 'Brown', id: 'brown', color: 'brown' }
]

function SearchFilterModal({
  isOpen,
  onClose,
  filters,
  updateFilters
}: {
  isOpen: boolean
  onClose: () => void
  filters: IPixabaySearchFilter
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}): React.ReactElement {
  const { t } = useTranslation('common.misc')

  return (
    <ModalWrapper isOpen={isOpen} minWidth="30vw">
      <ModalHeader
        icon="tabler:filter"
        title="Search Filters"
        onClose={onClose}
      />
      <div className="space-y-4">
        <ListboxOrComboboxInput
          buttonContent={
            <>
              <Icon
                className="size-5"
                icon={
                  IMAGE_TYPES.find(l => l.id === filters.imageType)?.icon ?? ''
                }
              />
              <span className="-mt-px block truncate">
                {t(
                  `imageUpload.imageType.${
                    IMAGE_TYPES.find(l => l.id === filters.imageType)?.id
                  }`
                )}
              </span>
            </>
          }
          icon="tabler:list"
          name="image type"
          namespace="common.misc"
          setValue={value => {
            updateFilters({ type: 'SET_IMAGE_TYPE', payload: value })
          }}
          tKey="imageUpload"
          type="listbox"
          value={filters.imageType}
        >
          {IMAGE_TYPES.map(({ icon, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              icon={icon}
              text={t(`imageUpload.imageType.${id}`)}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <ListboxOrComboboxInput
          buttonContent={
            <>
              <Icon
                className="size-5"
                icon={
                  CATEGORIES.find(l => l.id === filters.category)?.icon ?? ''
                }
              />
              <span className="-mt-px block truncate">
                {CATEGORIES.find(l => l.id === filters.category)?.name ??
                  'None'}
              </span>
            </>
          }
          icon="tabler:category"
          name="image Category"
          namespace="common.misc"
          setValue={value => {
            updateFilters({ type: 'SET_CATEGORY', payload: value })
          }}
          tKey="imageUpload"
          type="listbox"
          value={filters.category}
        >
          {CATEGORIES.map(({ name, icon, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              icon={icon}
              text={name}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <ListboxOrComboboxInput
          buttonContent={
            <>
              <div
                className="size-3 rounded-full border border-bg-200 dark:border-bg-700"
                style={{
                  backgroundColor: COLORS.find(l => l.id === filters.colors)
                    ?.color
                }}
              />
              <span className="-mt-px block truncate">
                {COLORS.find(l => l.id === filters.colors)?.name ?? 'None'}
              </span>
            </>
          }
          icon="tabler:color-swatch"
          name="Image Color"
          namespace="common.misc"
          setValue={value => {
            updateFilters({ type: 'SET_COLORS', payload: value })
          }}
          tKey="imageUpload"
          type="listbox"
          value={filters.colors}
        >
          {COLORS.map(({ name, color, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              color={color}
              text={name}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Icon className="size-6" icon="tabler:user-star" />
            <span className="text-lg">
              {t('imageUpload.inputs.editorsChoice')}
            </span>
          </div>
          <Switch
            checked={filters.isEditorsChoice}
            className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full',
              filters.isEditorsChoice
                ? 'bg-custom-500'
                : 'bg-bg-300 dark:bg-bg-800'
            )}
            onChange={() => {
              updateFilters({
                type: 'SET_IS_EDITORS_CHOICE',
                payload: !filters.isEditorsChoice
              })
            }}
          >
            <span
              className={clsx(
                'inline-block size-4 rounded-full transition',
                filters.isEditorsChoice
                  ? 'translate-x-6 bg-bg-100'
                  : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
              )}
            />
          </Switch>
        </div>
      </div>
      <Button className="mt-6" icon="tabler:check" onClick={onClose}>
        Apply Filters
      </Button>
    </ModalWrapper>
  )
}

export default SearchFilterModal
