import { useCallback, useRef, useState } from 'react'

import {
  Button,
  ContextMenuItem,
  Flex,
  ModuleHeader,
  useModalStore
} from '@lifeforge/ui'

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
    <Flex ref={wrapperRef} direction="column" flex="1" mb="2xl">
      <ModuleHeader
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:pencil"
                label={'Edit Layout'}
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

      {/* Save Button Popup */}
      {canLayoutChange && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="bg-bg-100 dark:bg-bg-800 flex items-center gap-4 rounded-md p-4 shadow-lg">
            <div className="min-w-0">
              <div className="text-sm font-medium">
                You are Editing Dashboard Layout
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon="tabler:device-floppy"
                onClick={() => setCanLayoutChange(false)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </Flex>
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
