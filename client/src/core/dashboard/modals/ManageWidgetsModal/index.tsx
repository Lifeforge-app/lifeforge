import { ModalHeader } from 'lifeforge-ui'

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
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:apps"
        namespace="common.dashboard"
        title="Manage Widgets"
        onClose={onClose}
      />
      <ul className="space-y-2 overflow-y-auto">
        {Object.entries(widgets).map(
          ([key, { icon, minW, minH, maxW, maxH, namespace }]) => (
            <ComponentListItem
              key={key}
              icon={icon}
              id={key}
              maxH={maxH}
              maxW={maxW}
              minH={minH}
              minW={minW}
              namespace={namespace ?? undefined}
            />
          )
        )}
      </ul>
    </div>
  )
}

export default ManageWidgetsModal
