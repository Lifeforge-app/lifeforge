import { Box, ModalHeader, Stack } from '@lifeforge/ui'

import type { WidgetEntry } from '../../providers/WidgetProvider'
import ComponentListItem from './components/ComponentItem'

function ManageWidgetsModal({
  onClose,
  data: { widgets }
}: {
  onClose: () => void
  data: { widgets: Record<string, WidgetEntry> }
}) {
  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:apps"
        namespace="common.dashboard"
        title="Manage Widgets"
        onClose={onClose}
      />
      <Stack as="ul">
        {Object.entries(widgets).map(
          ([key, { icon, minW, minH, maxW, maxH, moduleName }]) => (
            <ComponentListItem
              key={key}
              icon={icon}
              id={key}
              maxH={maxH}
              maxW={maxW}
              minH={minH}
              minW={minW}
              moduleName={moduleName ?? undefined}
            />
          )
        )}
      </Stack>
    </Box>
  )
}

export default ManageWidgetsModal
