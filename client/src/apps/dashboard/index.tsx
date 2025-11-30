import { ContextMenuItem, ModuleHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useRef, useState } from 'react'

import DashboardGrid from './components/DashboardGrid'
import ManageWidgetsModal from './modals/ManageWidgetsModal'

function Dashboard() {
  const open = useModalStore(state => state.open)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [canLayoutChange, setCanLayoutChange] = useState(false)

  const handleManageWidget = useCallback(() => {
    open(ManageWidgetsModal, {})
  }, [])

  return (
    <>
      <div ref={wrapperRef} className="mb-12 flex w-full flex-1 flex-col">
        <ModuleHeader
          contextMenuProps={{
            children: (
              <>
                <ContextMenuItem
                  icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                  label={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                  namespace="apps.dashboard"
                  onClick={() => {
                    setCanLayoutChange(!canLayoutChange)
                  }}
                />
                <ContextMenuItem
                  icon="tabler:apps"
                  label="Manage Widgets"
                  namespace="apps.dashboard"
                  onClick={handleManageWidget}
                />
              </>
            )
          }}
        />
        <DashboardGrid
          canLayoutChange={canLayoutChange}
          wrapperRef={wrapperRef}
        />
      </div>
    </>
  )
}

export default Dashboard
