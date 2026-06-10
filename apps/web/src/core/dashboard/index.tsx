import { useCallback, useRef, useState } from 'react'

import {
  ContextMenuItem,
  Flex,
  ModuleHeader,
  useModalStore
} from '@lifeforge/ui'

import DashboardGrid from './components/DashboardGrid'
import SaveButtonPopup from './components/SaveButtonPopup'
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
  }, [widgets, open])

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

      <SaveButtonPopup
        canChange={canLayoutChange}
        setCanChange={setCanLayoutChange}
      />
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
