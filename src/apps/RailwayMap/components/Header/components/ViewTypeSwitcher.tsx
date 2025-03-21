import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions
} from '@lifeforge/ui'

import { IRailwayMapViewType } from '@apps/RailwayMap/interfaces/railway_map_interfaces'

import useComponentBg from '@hooks/useComponentBg'

export const VIEW_TYPES = [
  ['tabler:route-alt-left', 'Route Map', 'route'],
  ['tabler:world', 'Earth Map', 'earth'],
  ['tabler:list', 'Station List', 'list']
] as const

interface ViewTypeSwitcherProps {
  viewType: IRailwayMapViewType
  setViewType: (viewType: IRailwayMapViewType) => void
}

function ViewTypeSwitcher({ viewType, setViewType }: ViewTypeSwitcherProps) {
  const { componentBgWithHover } = useComponentBg()
  const { t } = useTranslation('apps.railwayMap')

  return (
    <Listbox
      as="div"
      className="relative hidden lg:block"
      value={viewType}
      onChange={value => {
        setViewType(value)
      }}
    >
      <ListboxButton
        className={clsx(
          'flex-between shadow-custom flex gap-12 gap-2 rounded-md p-4',
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
          <span className="whitespace-nowrap font-medium">
            {t(
              `viewTypes.${_.camelCase(
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
            text={t(`viewTypes.${_.camelCase(name)}`)}
            value={value}
          />
        ))}
      </ListboxOrComboboxOptions>
    </Listbox>
  )
}

export default ViewTypeSwitcher
