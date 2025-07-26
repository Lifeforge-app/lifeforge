import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Outlet } from 'react-router'

export type RailwayMapStation = InferOutput<
  typeof forgeAPI.railwayMap.getStations
>[number]

export type RailwayMapLine = InferOutput<
  typeof forgeAPI.railwayMap.getLines
>[number]

export type RailwayMapViewType = 'route' | 'earth' | 'list'

interface IRailwayMapData {
  viewType: RailwayMapViewType
  setViewType: React.Dispatch<React.SetStateAction<RailwayMapViewType>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  lines: RailwayMapLine[]
  linesLoading: boolean
  stations: RailwayMapStation[]
  stationsLoading: boolean
  filteredLines: string[]
  setFilteredLines: React.Dispatch<React.SetStateAction<string[]>>
  routePlannerStart: string
  setRoutePlannerStart: React.Dispatch<React.SetStateAction<string>>
  routePlannerEnd: string
  setRoutePlannerEnd: React.Dispatch<React.SetStateAction<string>>
  shortestRoute: RailwayMapStation[] | 'loading' | 'error'
  setShortestRoute: React.Dispatch<
    React.SetStateAction<RailwayMapStation[] | 'loading' | 'error'>
  >
  routeMapSVGRef: React.RefObject<SVGSVGElement | null>
  routeMapGRef: React.RefObject<SVGGElement | null>
  selectedStation: RailwayMapStation | null
  setSelectedStation: React.Dispatch<
    React.SetStateAction<RailwayMapStation | null>
  >
  centerStation: RailwayMapStation | undefined
}

export const RailwayMapContext = createContext<IRailwayMapData | undefined>(
  undefined
)

export default function RailwayMapProvider() {
  const [viewType, setViewType] = useState<RailwayMapViewType>('route')

  const [searchQuery, setSearchQuery] = useState('')

  const linesQuery = useQuery(forgeAPI.railwayMap.getLines.queryOptions())

  const stationsQuery = useQuery(forgeAPI.railwayMap.getStations.queryOptions())

  const [filteredLines, setFilteredLines] = useState<string[]>([])

  const [routePlannerStart, setRoutePlannerStart] = useState('')

  const [routePlannerEnd, setRoutePlannerEnd] = useState('')

  const [shortestRoute, setShortestRoute] = useState<
    RailwayMapStation[] | 'loading' | 'error'
  >([])

  const [selectedStation, setSelectedStation] =
    useState<RailwayMapStation | null>(null)

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
