import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { Button } from '@components/buttons'
import DashboardItem from '@components/utilities/DashboardItem'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import StationSelector from './components/StationSelector'
import { filterStations } from './utils/stations'

function RoutePlanner(): React.ReactElement {
  const {
    fetchShortestRoute,
    clearShortestRoute,
    lines,
    routePlannerLoading: loading,
    stations,
    routePlannerStart: start,
    routePlannerEnd: end,
    setRoutePlannerStart: setStart,
    setRoutePlannerEnd: setEnd,
    routePlannerOpen: isOpen,
    shortestRoute
  } = useRailwayMapContext()
  const [startQuery, setStartQuery] = useState('')
  const [endQuery, setEndQuery] = useState('')

  const filteredStart = useMemo(
    () => filterStations(stations, startQuery),
    [stations, startQuery]
  )

  const filteredEnd = useMemo(
    () => filterStations(stations, endQuery),
    [stations, endQuery]
  )

  const handleClearRoute = () => {
    setStart('')
    setEnd('')
    setStartQuery('')
    setEndQuery('')
    clearShortestRoute()
  }

  return (
    <DashboardItem
      className={clsx(
        'h-min overflow-hidden px-4 transition-all duration-500',
        isOpen ? 'mt-4 max-h-[calc(100vh-4rem)] py-4' : 'mt-0 max-h-0 py-0'
      )}
      componentBesideTitle={
        shortestRoute.length > 0 && (
          <Button
            isRed
            icon="tabler:trash"
            variant="no-bg"
            onClick={handleClearRoute}
          />
        )
      }
      icon="tabler:route"
      namespace="modules.railwayMap"
      title="Route Planner"
    >
      <div className="flex w-full items-center gap-4">
        <StationSelector
          className="w-1/2"
          filteredStations={filteredStart}
          icon="material-symbols:start-rounded"
          lines={lines}
          name="Boarding at"
          namespace="modules.railwayMap"
          setQuery={setStartQuery}
          setValue={setStart}
          stations={stations}
          value={start}
        />
        <Icon className="size-6 text-zinc-500" icon="tabler:arrows-exchange" />
        <StationSelector
          className="w-1/2"
          filteredStations={filteredEnd}
          icon="tabler:flag"
          lines={lines}
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
        className="mt-2"
        disabled={start === '' || end === ''}
        icon="tabler:arrow-right"
        loading={loading}
        onClick={() => {
          fetchShortestRoute().catch(console.error)
        }}
      >
        Show Route
      </Button>
    </DashboardItem>
  )
}

export default RoutePlanner
