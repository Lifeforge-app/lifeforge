import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import React, { useRef, useState } from 'react'

import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
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
          title="Dashboard"
          hamburgerMenuItems={
            <>
              <MenuItem
                icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                text={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                onClick={() => {
                  setCanLayoutChange(!canLayoutChange)
                }}
              />
              <MenuItem
                icon="tabler:apps"
                text="Manage Widgets"
                onClick={() => {
                  setManageWidgetsModalOpen(true)
                }}
              />
            </>
          }
        />
        {isReady && (
          <DashboardGrid
            wrapperRef={wrapperRef}
            canLayoutChange={canLayoutChange}
          />
        )}
      </div>
      <ManageWidgetsModal
        isOpen={manageWidgetsModalOpen}
        onClose={() => {
          setManageWidgetsModalOpen(false)
        }}
        setReady={setReady}
      />
      {/* <FAB alwaysShow text="Ask AI" icon="mage:stars-c" onClick={() => {}} /> */}
    </ModuleWrapper>
  )
}

export default Dashboard
