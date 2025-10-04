import type { RailwayMapStation } from '@/providers/RailwayMapProvider'

export const filterStations = (stations: RailwayMapStation[], query: string) =>
  stations.filter(
    station =>
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.codes.some((code: string) =>
        code.toLowerCase().includes(query.toLowerCase())
      )
  )

export const formatStationDisplay = (
  stations: RailwayMapStation[],
  stationId: string
) => {
  const station = stations.find(s => s.id === stationId)

  if (!station) return ''

  return `${station.name} (${station.codes.join(', ')})`
}
