import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import {
  type PixabaySearchFilterAction,
  type IPixabaySearchFilter
} from '@interfaces/pixabay_interfaces'

const IMAGE_TYPES = [
  { name: 'All', id: 'all', icon: 'tabler:category' },
  { name: 'Photo', id: 'photo', icon: 'tabler:photo' },
  { name: 'Illustration', id: 'illustration', icon: 'tabler:brush' },
  { name: 'Vector', id: 'vector', icon: 'tabler:vector' }
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
  return (
    <ModalWrapper affectHeader={false} isOpen={isOpen} minWidth="30vw">
      <ModalHeader
        icon="tabler:filter"
        title="Search Filters"
        onClose={onClose}
      />
      <div className="space-y-4">
        <ListboxOrComboboxInput
          type="listbox"
          name={t('input.imageType')}
          icon="tabler:list"
          value={filters.imageType}
          setValue={value => {
            updateFilters({ type: 'SET_IMAGE_TYPE', payload: value })
          }}
          buttonContent={
            <>
              <Icon
                icon={
                  IMAGE_TYPES.find(l => l.id === filters.imageType)?.icon ?? ''
                }
                className="size-5"
              />
              <span className="-mt-px block truncate">
                {IMAGE_TYPES.find(l => l.id === filters.imageType)?.name ??
                  'None'}
              </span>
            </>
          }
        >
          {IMAGE_TYPES.map(({ name, icon, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              text={name}
              icon={icon}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <ListboxOrComboboxInput
          type="listbox"
          name={t('input.category')}
          icon="tabler:category"
          value={filters.category}
          setValue={value => {
            updateFilters({ type: 'SET_CATEGORY', payload: value })
          }}
          buttonContent={
            <>
              <Icon
                icon={
                  CATEGORIES.find(l => l.id === filters.category)?.icon ?? ''
                }
                className="size-5"
              />
              <span className="-mt-px block truncate">
                {CATEGORIES.find(l => l.id === filters.category)?.name ??
                  'None'}
              </span>
            </>
          }
        >
          {CATEGORIES.map(({ name, icon, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              text={name}
              icon={icon}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <ListboxOrComboboxInput
          type="listbox"
          name={t('input.imageColors')}
          icon="tabler:color-swatch"
          value={filters.colors}
          setValue={value => {
            updateFilters({ type: 'SET_COLORS', payload: value })
          }}
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
        >
          {COLORS.map(({ name, color, id }, i) => (
            <ListboxOrComboboxOption
              key={i}
              text={name}
              color={color}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Icon icon="tabler:user-star" className="size-6" />
            <span className="text-lg">{t('input.editorsChoice')}</span>
          </div>
          <Switch
            checked={filters.isEditorsChoice}
            onChange={() => {
              updateFilters({
                type: 'SET_IS_EDITORS_CHOICE',
                payload: !filters.isEditorsChoice
              })
            }}
            className={`${
              filters.isEditorsChoice
                ? 'bg-custom-500'
                : 'bg-bg-300 dark:bg-bg-800'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                filters.isEditorsChoice
                  ? 'translate-x-6 bg-bg-100'
                  : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
              } inline-block size-4 rounded-full transition`}
            />
          </Switch>
        </div>
      </div>
      <Button onClick={onClose} icon="tabler:check" className="mt-6">
        Apply Filters
      </Button>
    </ModalWrapper>
  )
}

export default SearchFilterModal
