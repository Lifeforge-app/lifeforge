import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

import DASHBOARD_WIDGETS from '../../constants/dashboard_widgets'
import ComponentListItem from './components/ComponentItem'

function ManageWidgetsModal({
  isOpen,
  onClose,
  setReady
}: {
  isOpen: boolean
  onClose: () => void
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="40vw">
      <ModalHeader
        icon="tabler:apps"
        namespace="core.dashboard"
        title="Manage Widgets"
        onClose={onClose}
      />
      <ul className="space-y-2 overflow-y-auto">
        {Object.entries(DASHBOARD_WIDGETS).map(
          ([key, { icon, minW, minH }]) => (
            <ComponentListItem
              key={key}
              icon={icon}
              id={key}
              minH={minH}
              minW={minW}
              setReady={setReady}
            />
          )
        )}
      </ul>
    </ModalWrapper>
  )
}
export default ManageWidgetsModal
