import type {
  RailwayMapLine,
  RailwayMapStation
} from '@apps/06.Information/railwayMap/providers/RailwayMapProvider'

export type RouteData = RailwayMapStation[] | 'loading' | 'error'

export const getLine = (
  station: RailwayMapStation,
  lines: RailwayMapLine[]
): RailwayMapLine | undefined => {
  const stationCode = station.codes[0]

  return lines.find(
    l =>
      stationCode.startsWith(l.code.slice(0, 2)) ||
      (l.code === 'EWL' && stationCode.startsWith('CG')) ||
      (l.code === 'CCL' && stationCode.startsWith('CE')) ||
      (l.code === 'DTL' && stationCode.startsWith('DE')) ||
      (l.code === 'JRL' && ['JW', 'JS'].includes(stationCode.slice(0, 2)))
  )
}

export const ignoreStation = (
  station: RailwayMapStation,
  shortestRoute: RouteData
): boolean => {
  return (
    !station.map_data ||
    (typeof shortestRoute !== 'string' &&
      shortestRoute.length > 0 &&
      !shortestRoute.some(s => s.id === station.id))
  )
}
