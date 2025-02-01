import React from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import DASHBOARD_WIDGETS from '@constants/dashboard_widgets'
import ComponentListItem from './components/ComponentItem'

function ManageWidgetsModal({
  isOpen,
  onClose,
  setReady
}: {
  isOpen: boolean
  onClose: () => void
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="40vw">
      <ModalHeader
        title="Manage Widgets"
        namespace="modules.dashboard"
        onClose={onClose}
        icon="tabler:apps"
      />
      <ul className="space-y-2 overflow-y-auto">
        {Object.entries(DASHBOARD_WIDGETS).map(
          ([key, { icon, minW, minH }]) => (
            <ComponentListItem
              key={key}
              id={key}
              icon={icon}
              minW={minW}
              minH={minH}
              setReady={setReady}
            />
          )
        )}
      </ul>
    </ModalWrapper>
  )
}
export default ManageWidgetsModal
