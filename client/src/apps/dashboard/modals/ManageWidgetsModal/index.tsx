import { ModalHeader } from 'lifeforge-ui'

import DASHBOARD_WIDGETS from '../../widgets'
import ComponentListItem from './components/ComponentItem'

function ManageWidgetsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:apps"
        namespace="apps.dashboard"
        title="Manage Widgets"
        onClose={onClose}
      />
      <ul className="space-y-2 overflow-y-auto">
        {Object.entries(DASHBOARD_WIDGETS).map(
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
