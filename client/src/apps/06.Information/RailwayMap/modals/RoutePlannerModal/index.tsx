import { ModalHeader } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useRailwayMapContext } from '@apps/06.Information/railwayMap/providers/RailwayMapProvider'

import PlannerContent from './components/PlannerContent'

function RoutePlannerModal({ onClose }: { onClose: () => void }) {
  const { setShortestRoute } = useRailwayMapContext()

  const [startQuery, setStartQuery] = useState('')

  const [endQuery, setEndQuery] = useState('')

  useEffect(() => {
    setStartQuery('')
    setEndQuery('')
    setShortestRoute([])
  }, [])

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:route"
        namespace="apps.railwayMap"
        title="Route Planner"
        onClose={onClose}
      />
      <PlannerContent
        endQuery={endQuery}
        setEndQuery={setEndQuery}
        setStartQuery={setStartQuery}
        startQuery={startQuery}
        onClose={onClose}
      />
    </div>
  )
}

export default RoutePlannerModal
