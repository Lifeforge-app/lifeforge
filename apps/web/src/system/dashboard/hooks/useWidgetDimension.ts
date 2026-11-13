import { useCallback } from 'react'

import { usePersonalization } from '@lifeforge/ui'

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

function useWidgetDimension() {
  const { dashboardLayout } = usePersonalization()

  const getDimension = useCallback(
    (widgetId: string, width: number) =>
      (dashboardLayout[getBreakpointFromWidth(width)] || []).find(
        l => l.i === widgetId
      ),
    [dashboardLayout]
  )

  return { getDimension }
}

export default useWidgetDimension
