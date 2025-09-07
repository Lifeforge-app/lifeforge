import { Icon } from '@iconify/react'
import { Listbox, ListboxOption } from 'lifeforge-ui'
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
      buttonContent={
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
      }
      className="component-bg-with-hover! hidden max-w-64 lg:flex"
      setValue={value => {
        setViewType(value)
      }}
      value={viewType}
    >
      {VIEW_TYPES.map(([icon, name, value]) => (
        <ListboxOption
          key={value}
          icon={icon}
          label={t(`viewTypes.${_.camelCase(name)}`)}
          value={value}
        />
      ))}
    </Listbox>
  )
}

export default ViewTypeSwitcher
