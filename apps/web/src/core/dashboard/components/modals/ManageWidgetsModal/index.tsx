import { useMemo } from 'react'

import { Box, ModalHeader, Stack } from '@lifeforge/ui'

import type { WidgetEntry } from '@/core/dashboard/providers/WidgetProvider'

import WidgetGroupItem from './components/WidgetGroupItem'

function ManageWidgetsModal({
  onClose,
  data: { widgets }
}: {
  onClose: () => void
  data: { widgets: Record<string, WidgetEntry> }
}) {
  const grouped = useMemo(() => {
    const acc: Record<string, Array<[string, WidgetEntry]>> = {}

    for (const [key, entry] of Object.entries(widgets)) {
      const group = entry.moduleName

      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push([key, entry])
    }

    return acc
  }, [widgets])

  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:apps"
        namespace="common.dashboard"
        title="Manage Widgets"
        onClose={onClose}
      />
      <Stack as="ul" gap="lg">
        {Object.entries(grouped).map(([moduleName, items]) => (
          <WidgetGroupItem
            key={moduleName}
            items={items}
            moduleName={moduleName}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default ManageWidgetsModal
