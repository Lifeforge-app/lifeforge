import _ from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  FAB,
  HamburgerMenuSelectorWrapper,
  MenuItem,
  ModuleHeader
} from '@lifeforge/ui'

import { useRailwayMapContext } from '../../providers/RailwayMapProvider'
import DetailBox from './components/DetailBox'
import LineFilter from './components/LineFilter'
import SearchBar from './components/SearchBar'
import ViewTypeSwitcher, { VIEW_TYPES } from './components/ViewTypeSwitcher'

function Header() {
  const { t } = useTranslation('apps.railwayMap')
  const {
    viewType,
    setViewType,
    setRoutePlannerOpen,
    shortestRoute,
    clearShortestRoute
  } = useRailwayMapContext()
  const hasRoute = useMemo(
    () => typeof shortestRoute !== 'string' && shortestRoute.length > 0,
    [shortestRoute]
  )

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon={hasRoute ? 'tabler:route-off' : 'tabler:route'}
            isRed={hasRoute}
            namespace="apps.railwayMap"
            variant={hasRoute ? 'plain' : 'primary'}
            onClick={() => {
              if (hasRoute) {
                clearShortestRoute()
              } else {
                setRoutePlannerOpen(true)
              }
            }}
          >
            {hasRoute ? 'clear Route' : 'Plan Route'}
          </Button>
        }
        hamburgerMenuItems={
          <>
            <HamburgerMenuSelectorWrapper
              className="lg:hidden"
              icon="tabler:eye"
              title={t('viewTypes.selectorTitle')}
            >
              {VIEW_TYPES.map(([icon, title, value]) => (
                <MenuItem
                  key={value}
                  icon={icon}
                  isToggled={viewType === value}
                  namespace={false}
                  text={t(`viewTypes.${_.camelCase(title)}`)}
                  onClick={() => {
                    setViewType(value)
                  }}
                />
              ))}
            </HamburgerMenuSelectorWrapper>
            <LineFilter />
          </>
        }
        icon="uil:subway"
        title="Railway Map"
      />
      <div className="mt-6 flex items-center gap-2">
        <ViewTypeSwitcher setViewType={setViewType} viewType={viewType} />
        <SearchBar />
      </div>
      <FAB
        hideWhen="md"
        icon={hasRoute ? 'tabler:route-off' : 'tabler:route'}
        isRed={shortestRoute.length > 0}
        loading={typeof shortestRoute === 'string'}
        onClick={() => {
          if (hasRoute) {
            clearShortestRoute()
          } else {
            setRoutePlannerOpen(true)
          }
        }}
      />
      <DetailBox />
    </>
  )
}

export default Header
