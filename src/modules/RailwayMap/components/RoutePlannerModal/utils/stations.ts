import { IRailwayMapStation } from '@interfaces/railway_map_interfaces'

export const filterStations = (stations: IRailwayMapStation[], query: string) =>
  stations.filter(
    station =>
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.codes.some(code =>
        code.toLowerCase().includes(query.toLowerCase())
      )
  )

export const formatStationDisplay = (
  stations: IRailwayMapStation[],
  stationId: string
) => {
  const station = stations.find(s => s.id === stationId)
  if (!station) return ''
  return `${station.name} (${station.codes.join(', ')})`
}
