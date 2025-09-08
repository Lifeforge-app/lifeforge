import type { RailwayMapStation } from '@apps/06.Information/RailwayMap/providers/RailwayMapProvider'

export const getConsecutiveLine = (
  station: RailwayMapStation,
  lastStation: RailwayMapStation
): string => {
  const stationLines = station.lines

  const lastStationLines = lastStation.lines

  const commonLine = [...new Set([...stationLines, ...lastStationLines])].find(
    line => stationLines.includes(line) && lastStationLines.includes(line)
  )

  return commonLine || ''
}

export const getLinesRequired = (
  shortestRoute: RailwayMapStation[]
): string[] => {
  const linesRequired: string[] = []

  let currentLine = ''
  let lastStation = shortestRoute[0]

  for (let i = 1; i < shortestRoute.length; i++) {
    const station = shortestRoute[i]

    const line = getConsecutiveLine(station, lastStation)

    if (line !== currentLine) {
      linesRequired.push(line)
    }

    currentLine = line
    lastStation = station
  }

  return linesRequired
}
