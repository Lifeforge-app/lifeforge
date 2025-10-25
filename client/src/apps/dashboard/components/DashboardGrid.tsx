import { useUserPersonalization } from '@/providers/UserPersonalizationProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { EmptyStateScreen, LoadingScreen } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useTranslation } from 'react-i18next'
import { useSidebarState } from 'shared'
import { usePersonalization } from 'shared'

import DASHBOARD_WIDGETS from '../widgets'
import NotFoundWidget from './NotFoundWidget'

const RGL: any = ResponsiveGridLayout as any

const COMPONENTS = Object.fromEntries(
  Object.entries(DASHBOARD_WIDGETS).map(([key, value]) => [
    key,
    value.component
  ])
)

function DashboardGrid({
  wrapperRef,
  canLayoutChange
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  canLayoutChange: boolean
}) {
  const { t } = useTranslation('apps.dashboard')

  const { sidebarExpanded } = useSidebarState()

  const [width, setWidth] = useState(0)

  const { dashboardLayout: enabledWidgets } = usePersonalization()

  const { changeDashboardLayout } = useUserPersonalization()

  function handleResize() {
    if (wrapperRef.current !== null) {
      setWidth(wrapperRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleResize()
    }, 200)
  }, [wrapperRef.current, sidebarExpanded])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [wrapperRef.current])

  const onLayoutChange = (_: any, layouts: any) => {
    changeDashboardLayout(layouts)
  }

  if (width === 0) {
    return <LoadingScreen customMessage={t('loading')} />
  }

  return Object.values(enabledWidgets).every(e => e.length === 0) ? (
    <div className="flex h-full flex-1 items-center justify-center">
      <EmptyStateScreen
        icon="tabler:hammer"
        name="welcome"
        namespace="apps.dashboard"
      />
    </div>
  ) : (
    <RGL
      className={canLayoutChange && 'pb-64'}
      cols={
        {
          lg: 8,
          md: 8,
          sm: 4,
          xs: 4,
          xxs: 4
        } as any
      }
      isDraggable={canLayoutChange}
      isDroppable={canLayoutChange}
      isResizable={canLayoutChange}
      layouts={enabledWidgets}
      rowHeight={100}
      width={width}
      onLayoutChange={onLayoutChange}
    >
      {[
        ...new Set(
          Object.values(enabledWidgets)
            .map(widgetArray => widgetArray.map(widget => widget.i))
            .flat()
        )
      ].map(widgetId => (
        <div key={widgetId} className={clsx(canLayoutChange && 'cursor-move')}>
          {(() => {
            const Component = (COMPONENTS[
              widgetId as keyof typeof COMPONENTS
            ] ?? NotFoundWidget) as React.FC<{
              widgetId?: string
            }>

            return <Component widgetId={widgetId} />
          })()}
          {canLayoutChange && (
            <Icon
              className="absolute bottom-0 right-0 text-2xl"
              icon="clarity:drag-handle-corner-line"
            />
          )}
        </div>
      ))}
    </RGL>
  )
}

export default DashboardGrid
