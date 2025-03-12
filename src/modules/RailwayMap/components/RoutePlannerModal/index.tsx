import React, { useEffect, useState } from 'react'

import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

import { useRailwayMapContext } from '../../providers/RailwayMapProvider'
import PlannerContent from './components/PlannerContent'

function RoutePlannerModal(): React.ReactElement {
  const {
    clearShortestRoute,
    routePlannerOpen: isOpen,
    setRoutePlannerOpen
  } = useRailwayMapContext()

  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStartQuery('')
      setEndQuery('')
      clearShortestRoute()
    }
  }, [isOpen])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="40vw">
      <ModalHeader
        icon="tabler:route"
        namespace="modules.railwayMap"
        title="Route Planner"
        onClose={() => setRoutePlannerOpen(false)}
      />
      <PlannerContent
        endQuery={endQuery}
        setEndQuery={setEndQuery}
        setStartQuery={setStartQuery}
        startQuery={startQuery}
      />
    </ModalWrapper>
  )
}

export default RoutePlannerModal
