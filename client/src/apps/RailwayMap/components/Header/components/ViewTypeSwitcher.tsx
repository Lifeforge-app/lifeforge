import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { ListboxOption, ListboxOptions } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import type { RailwayMapViewType } from '@apps/RailwayMap/providers/RailwayMapProvider'

export const VIEW_TYPES = [
  ['tabler:route-alt-left', 'Route Map', 'route'],
  ['tabler:world', 'Earth Map', 'earth'],
  ['tabler:list', 'Station List', 'list']
] as const

interface ViewTypeSwitcherProps {
  viewType: RailwayMapViewType
  setViewType: (viewType: RailwayMapViewType) => void
}

function ViewTypeSwitcher({ viewType, setViewType }: ViewTypeSwitcherProps) {
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
      <ListboxButton className="flex-between shadow-custom component-bg-with-hover flex gap-2 gap-12 rounded-md p-4">
        <div className="flex items-center gap-2">
          <Icon
            className="size-6"
            icon={
              VIEW_TYPES.find(([, , value]) => value === viewType)?.[0] ?? ''
            }
          />
          <span className="font-medium whitespace-nowrap">
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
      <ListboxOptions>
        {VIEW_TYPES.map(([icon, name, value]) => (
          <ListboxOption
            key={value}
            icon={icon}
            text={t(`viewTypes.${_.camelCase(name)}`)}
            value={value}
          />
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

export default ViewTypeSwitcher
