import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import { Button } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import { useRailwayMapContext } from '../../../providers/RailwayMapProvider'
import { filterStations } from '../utils/stations'
import StationSelector from './StationSelector'

function PlannerContent({
  startQuery,
  endQuery,
  setStartQuery,
  setEndQuery,
  onClose
}: {
  startQuery: string
  endQuery: string
  setStartQuery: (query: string) => void
  setEndQuery: (query: string) => void
  onClose: () => void
}) {
  const {
    stations,
    routePlannerStart: start,
    routePlannerEnd: end,
    setRoutePlannerStart: setStart,
    setRoutePlannerEnd: setEnd,
    setSelectedStation,
    setShortestRoute
  } = useRailwayMapContext()

  const filteredStart = useMemo(
    () => filterStations(stations, startQuery),
    [stations, startQuery]
  )

  const filteredEnd = useMemo(
    () => filterStations(stations, endQuery),
    [stations, endQuery]
  )

  const handleSubmit = useCallback(async () => {
    if (!start || !end) {
      toast.error('Please select a start and end station.')

      return
    }

    setShortestRoute('loading')

    try {
      if (!start || !end) {
        toast.error('Please select a start and end station.')

        return
      }

      const data = await forgeAPI.railwayMap.getShortestPath
        .input({
          start,
          end
        })
        .query()

      if (!data) {
        toast.error('No route found.')

        return
      }

      setShortestRoute(data)
      setStartQuery('')
      setEndQuery('')
      setStart('')
      setEnd('')
      setSelectedStation(null)
      onClose()
    } catch (error) {
      setShortestRoute('error')
      console.error('Error fetching shortest route:', error)
    }
  }, [start, end])

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3">
        <StationSelector
          className="w-full"
          filteredStations={filteredStart}
          icon="material-symbols:start-rounded"
          name="Boarding at"
          namespace="apps.railwayMap"
          setQuery={setStartQuery}
          setValue={setStart}
          stations={stations}
          value={start}
        />
        <Icon
          className="text-bg-500 size-6 rotate-90"
          icon="tabler:arrows-exchange"
        />
        <StationSelector
          className="w-full"
          filteredStations={filteredEnd}
          icon="tabler:flag"
          name="Alighting at"
          namespace="apps.railwayMap"
          setQuery={setEndQuery}
          setValue={setEnd}
          stations={stations}
          value={end}
        />
      </div>
      <Button
        className="mt-6 w-full"
        disabled={start === '' || end === '' || start === end}
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={loading}
        onClick={onSubmit}
      >
        submit
      </Button>
    </>
  )
}

export default PlannerContent
