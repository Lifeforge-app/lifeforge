import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'

export type RouteData = IRailwayMapStation[] | 'loading' | 'error'

export const getLine = (
  station: IRailwayMapStation,
  lines: IRailwayMapLine[]
): IRailwayMapLine | undefined => {
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
  station: IRailwayMapStation,
  shortestRoute: RouteData
): boolean => {
  return (
    !station.map_data ||
    (typeof shortestRoute !== 'string' &&
      shortestRoute.length > 0 &&
      !shortestRoute.some(s => s.id === station.id))
  )
}
