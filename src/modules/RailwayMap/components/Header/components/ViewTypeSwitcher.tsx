import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions
} from '@components/inputs'
import useThemeColors from '@hooks/useThemeColor'
import { toCamelCase } from '@utils/strings'

export const VIEW_TYPES = [
  ['tabler:route-alt-left', 'Route Map', 'route'],
  ['tabler:world', 'Earth Map', 'earth'],
  ['tabler:list', 'Station List', 'list']
]

interface ViewTypeSwitcherProps {
  viewType: 'route' | 'earth' | 'list'
  setViewType: (viewType: 'route' | 'earth' | 'list') => void
}

function ViewTypeSwitcher({
  viewType,
  setViewType
}: ViewTypeSwitcherProps): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const { t } = useTranslation('modules.railwayMap')

  return (
    <Listbox
      as="div"
      className="relative hidden md:block"
      value={viewType}
      onChange={value => {
        setViewType(value)
      }}
    >
      <ListboxButton
        className={clsx(
          'flex-between shadow-custom flex gap-2 gap-12 rounded-md p-4',
          componentBgWithHover
        )}
      >
        <div className="flex items-center gap-2">
          <Icon
            className="size-6"
            icon={
              VIEW_TYPES.find(([, , value]) => value === viewType)?.[0] ?? ''
            }
          />
          <span className="font-medium whitespace-nowrap">
            {t(
              `viewTypes.${toCamelCase(
                VIEW_TYPES.find(([, , value]) => value === viewType)?.[1] ?? ''
              )}`
            )}
          </span>
        </div>
        <Icon
          className="text-bg-500 size-5 shrink-0"
          icon="tabler:chevron-down"
        />
      </ListboxButton>
      <ListboxOrComboboxOptions>
        {VIEW_TYPES.map(([icon, name, value]) => (
          <ListboxOrComboboxOption
            key={value}
            icon={icon}
            text={t(`viewTypes.${toCamelCase(name)}`)}
            value={value}
          />
        ))}
      </ListboxOrComboboxOptions>
    </Listbox>
  )
}

export default ViewTypeSwitcher
