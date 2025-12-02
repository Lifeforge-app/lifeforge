import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { EmptyStateScreen, LoadingScreen } from 'lifeforge-ui'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useTranslation } from 'react-i18next'
import { useDivSize, usePersonalization } from 'shared'

import DASHBOARD_WIDGETS from '../widgets'
import NotFoundWidget from './NotFoundWidget'

const COMPONENTS = Object.fromEntries(
  Object.entries(DASHBOARD_WIDGETS).map(([key, value]) => [
    key,
    value.component
  ])
)

function getBreakpointFromWidth(width: number) {
  if (width >= 1200) {
    return 'lg'
  } else if (width >= 996) {
    return 'md'
  } else if (width >= 768) {
    return 'sm'
  } else if (width >= 480) {
    return 'xs'
  } else {
    return 'xxs'
  }
}

function DashboardGrid({
  wrapperRef,
  canLayoutChange
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  canLayoutChange: boolean
}) {
  const { t } = useTranslation('apps.dashboard')

  const { width, height } = useDivSize(wrapperRef)

  const { dashboardLayout: enabledWidgets } = usePersonalization()

  const { changeDashboardLayout } = useUserPersonalization()

  if (width === 0) {
    return <LoadingScreen message={t('loading')} />
  }

  if (Object.values(enabledWidgets).every(e => e.length === 0)) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <EmptyStateScreen
          icon="tabler:hammer"
          message={{
            id: 'welcome',
            namespace: 'apps.dashboard'
          }}
        />
      </div>
    )
  }

  return (
    <ResponsiveGridLayout
      autoSize
      className={canLayoutChange ? 'pb-64' : undefined}
      cols={
        {
          lg: 8,
          md: 8,
          sm: 4,
          xs: 4,
          xxs: 4
        } as any
      }
      containerPadding={[0, 0]}
      isDraggable={canLayoutChange}
      isDroppable={canLayoutChange}
      isResizable={canLayoutChange}
      layouts={enabledWidgets}
      margin={[10, 10]}
      rowHeight={100}
      width={width}
      onLayoutChange={(_: any, layouts: any) => {
        changeDashboardLayout(layouts)
      }}
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
            if (!width || !height) {
              return null
            }

            const Component = (COMPONENTS[
              widgetId as keyof typeof COMPONENTS
            ] ?? NotFoundWidget) as React.FC<{
              dimension: { w: number; h: number }
              widgetId?: string
            }>

            const dimension = (
              enabledWidgets[getBreakpointFromWidth(width)] || []
            ).find(l => l.i === widgetId)

            return (
              <Component
                dimension={{
                  w: dimension?.w ?? 0,
                  h: dimension?.h ?? 0
                }}
                widgetId={widgetId}
              />
            )
          })()}
          {canLayoutChange && (
            <Icon
              className="absolute right-0 bottom-0 text-2xl"
              icon="clarity:drag-handle-corner-line"
            />
          )}
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}

export default DashboardGrid
