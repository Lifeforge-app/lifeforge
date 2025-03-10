import React, { useEffect, useState } from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import PlannerContent from './components/PlannerContent'

function RoutePlannerModal(): React.ReactElement {
  const {
    clearShortestRoute,
    setRoutePlannerStart: setStart,
    setRoutePlannerEnd: setEnd,
    routePlannerOpen: isOpen,
    setRoutePlannerOpen
  } = useRailwayMapContext()

  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')

  const handleClearRoute = () => {
    setStart('')
    setEnd('')
    setStartQuery('')
    setEndQuery('')
    clearShortestRoute()
  }

  useEffect(() => {
    if (isOpen) {
      handleClearRoute()
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
