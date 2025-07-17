import {
  Button,
  FAB,
  HamburgerMenuSelectorWrapper,
  MenuItem,
  ModuleHeader
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import RoutePlannerModal from '@apps/RailwayMap/modals/RoutePlannerModal'

import { useRailwayMapContext } from '../../providers/RailwayMapProvider'
import DetailBox from './components/DetailBox'
import LineFilter from './components/LineFilter'
import SearchBar from './components/SearchBar'
import ViewTypeSwitcher, { VIEW_TYPES } from './components/ViewTypeSwitcher'

function Header() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.railwayMap')
  const { viewType, setViewType, shortestRoute, setShortestRoute } =
    useRailwayMapContext()
  const hasRoute = useMemo(
    () => typeof shortestRoute !== 'string' && shortestRoute.length > 0,
    [shortestRoute]
  )

  const handleRoutePlannerToggle = useCallback(() => {
    if (hasRoute) {
      setShortestRoute([])
    } else {
      open(RoutePlannerModal, {})
    }
  }, [hasRoute])

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
            onClick={handleRoutePlannerToggle}
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
      <div className="flex items-center gap-2">
        <ViewTypeSwitcher setViewType={setViewType} viewType={viewType} />
        <SearchBar />
      </div>
      <FAB
        hideWhen="md"
        icon={hasRoute ? 'tabler:route-off' : 'tabler:route'}
        isRed={shortestRoute.length > 0}
        loading={typeof shortestRoute === 'string'}
        onClick={handleRoutePlannerToggle}
      />
      <DetailBox />
    </>
  )
}

export default Header
