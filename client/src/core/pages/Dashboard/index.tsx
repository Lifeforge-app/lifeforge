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
import { ContextMenuItem, ModuleHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useRef, useState } from 'react'

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
    <>
      <div ref={wrapperRef} className="mb-12 flex w-full flex-1 flex-col">
        <ModuleHeader
          contextMenuProps={{
            children: (
              <>
                <ContextMenuItem
                  icon={canLayoutChange ? 'tabler:lock-open' : 'tabler:lock'}
                  label={canLayoutChange ? 'Lock Layout' : 'Unlock Layout'}
                  namespace="core.dashboard"
                  onClick={() => {
                    setCanLayoutChange(!canLayoutChange)
                  }}
                />
                <ContextMenuItem
                  icon="tabler:apps"
                  label="Manage Widgets"
                  namespace="core.dashboard"
                  onClick={handleManageWidget}
                />
              </>
            )
          }}
        />
        {isReady && (
          <DashboardGrid
            canLayoutChange={canLayoutChange}
            wrapperRef={wrapperRef}
          />
        )}
      </div>
      {/* <FAB
        icon="mage:stars-c"
        visibilityBreakpoint={false}
        onClick={() => {
          open(ForgeAgentModal, {})
        }}
      >
        Forge Agent
      </FAB> */}
    </>
  )
}

export default Dashboard
