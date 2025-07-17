import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Outlet } from 'react-router'

import {
  IRailwayMapLine,
  IRailwayMapStation,
  IRailwayMapViewType
} from '@apps/RailwayMap/interfaces/railway_map_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

interface IRailwayMapData {
  viewType: IRailwayMapViewType
  setViewType: React.Dispatch<React.SetStateAction<IRailwayMapViewType>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  lines: IRailwayMapLine[]
  linesLoading: boolean
  stations: IRailwayMapStation[]
  stationsLoading: boolean
  filteredLines: string[]
  setFilteredLines: React.Dispatch<React.SetStateAction<string[]>>
  routePlannerStart: string
  setRoutePlannerStart: React.Dispatch<React.SetStateAction<string>>
  routePlannerEnd: string
  setRoutePlannerEnd: React.Dispatch<React.SetStateAction<string>>
  shortestRoute: IRailwayMapStation[] | 'loading' | 'error'
  setShortestRoute: React.Dispatch<
    React.SetStateAction<IRailwayMapStation[] | 'loading' | 'error'>
  >
  routeMapSVGRef: React.RefObject<SVGSVGElement | null>
  routeMapGRef: React.RefObject<SVGGElement | null>
  selectedStation: IRailwayMapStation | null
  setSelectedStation: React.Dispatch<
    React.SetStateAction<IRailwayMapStation | null>
  >
  centerStation: IRailwayMapStation | undefined
}

export const RailwayMapContext = createContext<IRailwayMapData | undefined>(
  undefined
)

export default function RailwayMapProvider() {
  const [viewType, setViewType] = useState<IRailwayMapViewType>('route')
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
  const [routePlannerStart, setRoutePlannerStart] = useState('')
  const [routePlannerEnd, setRoutePlannerEnd] = useState('')
  const [shortestRoute, setShortestRoute] = useState<
    IRailwayMapStation[] | 'loading' | 'error'
  >([])
  const [selectedStation, setSelectedStation] =
    useState<IRailwayMapStation | null>(null)
  const centerStation = useMemo(() => {
    return stationsQuery.data?.find(station => station.name === 'Novena')
  }, [stationsQuery.data])

  const routeMapSVGRef = useRef<SVGSVGElement>(null)
  const routeMapGRef = useRef<SVGGElement>(null)

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
      routePlannerStart,
      setRoutePlannerStart,
      routePlannerEnd,
      setRoutePlannerEnd,
      shortestRoute,
      setShortestRoute,
      routeMapSVGRef,
      routeMapGRef,
      selectedStation,
      setSelectedStation,
      centerStation
    }),
    [
      viewType,
      searchQuery,
      linesQuery.data,
      linesQuery.isLoading,
      stationsQuery.data,
      stationsQuery.isLoading,
      filteredLines,
      routePlannerStart,
      routePlannerEnd,
      shortestRoute,
      routeMapSVGRef,
      routeMapGRef,
      selectedStation,
      centerStation
    ]
  )

  return (
    <RailwayMapContext.Provider value={value}>
      <Outlet />
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
