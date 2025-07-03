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
import { useCallback, useRef, useState } from 'react'

import { MenuItem, ModuleHeader, ModuleWrapper } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import DashboardGrid from './components/DashboardGrid'
import ManageWidgetsModal from './modals/ManageWidgetsModal'

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

function Dashboard() {
  const open = useModalStore(state => state.open)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [canLayoutChange, setCanLayoutChange] = useState(false)

  const [isReady, setReady] = useState(true)

  const handleManageWidget = useCallback(() => {
    open(ManageWidgetsModal, {
      setReady
    })
  }, [])

  return (
    <ModuleWrapper>
      <div ref={wrapperRef} className="mb-12 flex w-full flex-1 flex-col">
        <ModuleHeader
          hamburgerMenuItems={
            <>
              <MenuItem
                icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                namespace="core.dashboard"
                text={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                onClick={() => {
                  setCanLayoutChange(!canLayoutChange)
                }}
              />
              <MenuItem
                icon="tabler:apps"
                namespace="core.dashboard"
                text="Manage Widgets"
                onClick={handleManageWidget}
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
      {/* <FAB alwaysShow text="Ask AI" icon="mage:stars-c" onClick={() => {}} /> */}
    </ModuleWrapper>
  )
}

export default Dashboard
