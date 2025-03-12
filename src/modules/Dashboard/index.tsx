import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import React, { useRef, useState } from 'react'

import { MenuItem , ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import DashboardGrid from './components/DashboardGrid'
import ManageWidgetsModal from './components/ManageWidgetsModal'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
)

function Dashboard(): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [canLayoutChange, setCanLayoutChange] = useState(false)
  const [manageWidgetsModalOpen, setManageWidgetsModalOpen] = useState(false)

  const [isReady, setReady] = useState(true)

  return (
    <ModuleWrapper>
      <div ref={wrapperRef} className="mb-12 flex w-full flex-1 flex-col">
        <ModuleHeader
          hamburgerMenuItems={
            <>
              <MenuItem
                icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                namespace="modules.dashboard"
                text={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                onClick={() => {
                  setCanLayoutChange(!canLayoutChange)
                }}
              />
              <MenuItem
                icon="tabler:apps"
                namespace="modules.dashboard"
                text="Manage Widgets"
                onClick={() => {
                  setManageWidgetsModalOpen(true)
                }}
              />
            </>
          }
          title="Dashboard"
        />
        {isReady && (
          <DashboardGrid
            canLayoutChange={canLayoutChange}
            wrapperRef={wrapperRef}
          />
        )}
      </div>
      <ManageWidgetsModal
        isOpen={manageWidgetsModalOpen}
        setReady={setReady}
        onClose={() => {
          setManageWidgetsModalOpen(false)
        }}
      />
      {/* <FAB alwaysShow text="Ask AI" icon="mage:stars-c" onClick={() => {}} /> */}
    </ModuleWrapper>
  )
}

export default Dashboard
