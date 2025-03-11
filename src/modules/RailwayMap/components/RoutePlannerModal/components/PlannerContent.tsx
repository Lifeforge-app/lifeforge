import { Icon } from '@iconify/react/dist/iconify.js'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import React, { useMemo } from 'react'

import { Button } from '@lifeforge/ui'

import { filterStations } from '../utils/stations'
import StationSelector from './StationSelector'

function PlannerContent({
  startQuery,
  endQuery,
  setStartQuery,
  setEndQuery
}: {
  startQuery: string
  endQuery: string
  setStartQuery: (query: string) => void
  setEndQuery: (query: string) => void
}): React.ReactElement {
  const {
    fetchShortestRoute,
    routePlannerLoading: loading,
    stations,
    routePlannerStart: start,
    routePlannerEnd: end,
    setRoutePlannerStart: setStart,
    setRoutePlannerEnd: setEnd,
    setRoutePlannerOpen,
    setSelectedStation
  } = useRailwayMapContext()

  const filteredStart = useMemo(
    () => filterStations(stations, startQuery),
    [stations, startQuery]
  )

  const filteredEnd = useMemo(
    () => filterStations(stations, endQuery),
    [stations, endQuery]
  )
  return (
    <>
      <div className="flex w-full flex-col items-center gap-4">
        <StationSelector
          className="w-full"
          filteredStations={filteredStart}
          icon="material-symbols:start-rounded"
          name="Boarding at"
          namespace="modules.railwayMap"
          setQuery={setStartQuery}
          setValue={setStart}
          stations={stations}
          value={start}
        />
        <Icon
          className="size-6 rotate-90 text-zinc-500"
          icon="tabler:arrows-exchange"
        />
        <StationSelector
          className="w-full"
          filteredStations={filteredEnd}
          icon="tabler:flag"
          name="Alighting at"
          namespace="modules.railwayMap"
          setQuery={setEndQuery}
          setValue={setEnd}
          stations={stations}
          value={end}
        />
      </div>
      <Button
        iconAtEnd
        className="mt-6"
        disabled={start === '' || end === '' || start === end}
        icon="tabler:arrow-right"
        loading={loading}
        onClick={() => {
          fetchShortestRoute()
            .then(() => {
              setStartQuery('')
              setEndQuery('')
              setStart('')
              setEnd('')
              setSelectedStation(null)
              setRoutePlannerOpen(false)
            })
            .catch(console.error)
        }}
      >
        submit
      </Button>
    </>
  )
}

export default PlannerContent
