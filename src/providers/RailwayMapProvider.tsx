import React, { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import useAPIQuery from '@hooks/useAPIQuery'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import fetchAPI from '@utils/fetchAPI'

interface IRailwayMapData {
  viewType: 'route' | 'earth' | 'list'
  setViewType: React.Dispatch<React.SetStateAction<'route' | 'earth' | 'list'>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  lines: IRailwayMapLine[]
  linesLoading: boolean
  stations: IRailwayMapStation[]
  stationsLoading: boolean
  filteredLines: string[]
  setFilteredLines: React.Dispatch<React.SetStateAction<string[]>>
  routePlannerOpen: boolean
  setRoutePlannerOpen: React.Dispatch<React.SetStateAction<boolean>>
  routePlannerStart: string
  setRoutePlannerStart: React.Dispatch<React.SetStateAction<string>>
  routePlannerEnd: string
  setRoutePlannerEnd: React.Dispatch<React.SetStateAction<string>>
  routePlannerLoading: boolean
  shortestRoute: IRailwayMapStation[]
  fetchShortestRoute: () => Promise<void>
  clearShortestRoute: () => void
}

export const RailwayMapContext = React.createContext<
  IRailwayMapData | undefined
>(undefined)

export default function RailwayMapProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [viewType, setViewType] = useState<'route' | 'earth' | 'list'>('route')
  const [searchQuery, setSearchQuery] = useState('')
  const linesQuery = useAPIQuery<IRailwayMapLine[]>('railway-map/lines', [
    'railway-map',
    'lines'
  ])
  const stationsQuery = useAPIQuery<IRailwayMapStation[]>(
    'railway-map/stations',
    ['railway-map', 'stations']
  )
  const [filteredLines, setFilteredLines] = useState<string[]>([])
  const [routePlannerOpen, setRoutePlannerOpen] = useState(false)
  const [routePlannerStart, setRoutePlannerStart] = useState('')
  const [routePlannerEnd, setRoutePlannerEnd] = useState('')
  const [routePlannerLoading, setRoutePlannerLoading] = useState(false)
  const [shortestRoute, setShortestRoute] = useState<IRailwayMapStation[]>([])

  async function fetchShortestRoute() {
    if (!routePlannerStart || !routePlannerEnd) {
      toast.error('Please select a start and end station')
      return
    }

    setRoutePlannerLoading(true)
    setShortestRoute([])
    try {
      const data = await fetchAPI<IRailwayMapStation[]>(
        `railway-map/shortest?start=${routePlannerStart}&end=${routePlannerEnd}`
      )
      setShortestRoute(data)
    } catch {
      toast.error('Failed to fetch shortest route')
    } finally {
      setRoutePlannerLoading(false)
    }
  }

  function clearShortestRoute() {
    setShortestRoute([])
  }

  useEffect(() => {
    if (linesQuery.data) {
      setFilteredLines(linesQuery.data.map(line => line.id))
    }
  }, [linesQuery.data])

  const value = useMemo(
    () => ({
      viewType,
      setViewType,
      searchQuery,
      setSearchQuery,
      lines: linesQuery.data ?? [],
      linesLoading: linesQuery.isLoading,
      stations: stationsQuery.data ?? [],
      stationsLoading: stationsQuery.isLoading,
      filteredLines,
      setFilteredLines,
      routePlannerOpen,
      setRoutePlannerOpen,
      routePlannerStart,
      setRoutePlannerStart,
      routePlannerEnd,
      setRoutePlannerEnd,
      routePlannerLoading,
      shortestRoute,
      fetchShortestRoute,
      clearShortestRoute
    }),
    [
      viewType,
      searchQuery,
      linesQuery.data,
      linesQuery.isLoading,
      stationsQuery.data,
      stationsQuery.isLoading,
      filteredLines,
      routePlannerOpen,
      routePlannerStart,
      routePlannerEnd,
      routePlannerLoading,
      shortestRoute
    ]
  )

  return (
    <RailwayMapContext.Provider value={value}>
      {children}
    </RailwayMapContext.Provider>
  )
}

export function useRailwayMapContext(): IRailwayMapData {
  const context = useContext(RailwayMapContext)
  if (context === undefined) {
    throw new Error(
      'useRailwayMapContext must be used within a RailwayMapProvider'
    )
  }
  return context
}
