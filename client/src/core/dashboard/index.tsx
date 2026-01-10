import { ContextMenuItem, ModuleHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useRef, useState } from 'react'

import DashboardGrid from './components/DashboardGrid'
import './index.css'
import ManageWidgetsModal from './modals/ManageWidgetsModal'
import WidgetProvider, { useWidgets } from './providers/WidgetProvider'

function DashboardContent() {
  const { open } = useModalStore()

  const { widgets } = useWidgets()

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [canLayoutChange, setCanLayoutChange] = useState(false)

  const handleManageWidget = useCallback(() => {
    open(ManageWidgetsModal, { widgets })
  }, [widgets])

  return (
    <div ref={wrapperRef} className="mb-12 flex w-full flex-1 flex-col">
      <ModuleHeader
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                label={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                namespace="common.dashboard"
                onClick={() => {
                  setCanLayoutChange(!canLayoutChange)
                }}
              />
              <ContextMenuItem
                icon="tabler:apps"
                label="Manage Widgets"
                namespace="common.dashboard"
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
  )
}

function Dashboard() {
  return (
    <WidgetProvider>
      <DashboardContent />
    </WidgetProvider>
  )
}

export default Dashboard
