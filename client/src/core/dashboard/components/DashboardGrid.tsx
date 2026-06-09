import { useMemo } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useTranslation } from 'react-i18next'

import { useDivSize } from '@lifeforge/ui'
import {
  Box,
  EmptyStateScreen,
  Icon,
  LoadingScreen,
  colorWithOpacity,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import { useWidgets } from '../providers/WidgetProvider'
import NotFoundWidget from './NotFoundWidget'

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
  const { t } = useTranslation('common.dashboard')

  const { widgets } = useWidgets()

  const COMPONENTS = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(widgets).map(([key, value]) => [key, value.component])
      ),
    [widgets]
  )

  const { width, height } = useDivSize(wrapperRef)

  const { dashboardLayout: enabledWidgets } = usePersonalization()

  const { changeDashboardLayout } = useUserPersonalization()

  if (width === 0) {
    return <LoadingScreen message={t('loading')} />
  }

  if (Object.values(enabledWidgets).every(e => e.length === 0)) {
    return (
      <Box asChild flex="1">
        <EmptyStateScreen
          icon="tabler:hammer"
          message={{
            id: 'welcome',
            namespace: 'common.dashboard'
          }}
        />
      </Box>
    )
  }

  return (
    <Box asChild style={canLayoutChange ? { marginBottom: '16em' } : undefined}>
      <ResponsiveGridLayout
        autoSize
        cols={{
          lg: 8,
          md: 8,
          sm: 4,
          xs: 4,
          xxs: 4
        }}
        containerPadding={[0, 0]}
        isDraggable={canLayoutChange}
        isDroppable={canLayoutChange}
        isResizable={canLayoutChange}
        layouts={enabledWidgets}
        margin={[10, 10]}
        rowHeight={100}
        width={width}
        onLayoutChange={(_, layouts) => {
          changeDashboardLayout(layouts as never)
        }}
      >
        {[
          ...new Set(
            Object.values(enabledWidgets)
              .map(widgetArray => widgetArray.map(widget => widget.i))
              .flat()
          )
        ].map(widgetId => (
          <Box
            key={widgetId}
            position="relative"
            style={{
              cursor: canLayoutChange ? 'move' : 'default'
            }}
          >
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
              <>
                <Box
                  bg={colorWithOpacity('bg-900', '30%')}
                  height="100%"
                  left="0"
                  position="absolute"
                  r="lg"
                  top="0"
                  width="100%"
                />
                <Box asChild bottom="0" position="absolute" right="0">
                  <Icon icon="clarity:drag-handle-corner-line" size="1.5em" />
                </Box>
              </>
            )}
          </Box>
        ))}
      </ResponsiveGridLayout>
    </Box>
  )
}

export default DashboardGrid
