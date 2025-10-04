import RoutePlannerModal from '@/modals/RoutePlannerModal'
import {
  Button,
  ContextMenuGroup,
  ContextMenuItem,
  FAB,
  ModuleHeader
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
            dangerous={hasRoute}
            icon={hasRoute ? 'tabler:route-off' : 'tabler:route'}
            namespace="apps.railwayMap"
            variant={hasRoute ? 'plain' : 'primary'}
            onClick={handleRoutePlannerToggle}
          >
            {hasRoute ? 'clear Route' : 'Plan Route'}
          </Button>
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuGroup
                className="lg:hidden"
                icon="tabler:eye"
                label={t('viewTypes.selectorTitle')}
              >
                {VIEW_TYPES.map(([icon, title, value]) => (
                  <ContextMenuItem
                    key={value}
                    checked={viewType === value}
                    icon={icon}
                    label={t(`viewTypes.${_.camelCase(title)}`)}
                    onClick={() => {
                      setViewType(value)
                    }}
                  />
                ))}
              </ContextMenuGroup>
              <LineFilter />
            </>
          )
        }}
      />
      <div className="mb-6 flex items-center gap-2">
        <ViewTypeSwitcher setViewType={setViewType} viewType={viewType} />
        <SearchBar />
      </div>
      <FAB
        dangerous={shortestRoute.length > 0}
        icon={hasRoute ? 'tabler:route-off' : 'tabler:route'}
        loading={typeof shortestRoute === 'string'}
        visibilityBreakpoint="md"
        onClick={handleRoutePlannerToggle}
      />
      <DetailBox />
    </>
  )
}

export default Header
