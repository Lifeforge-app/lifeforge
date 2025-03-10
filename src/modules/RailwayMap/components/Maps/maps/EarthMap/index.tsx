import React, { memo, useRef, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { useEarthMapRenderer } from './hooks/useEarthMapRenderer'

function EarthMap({
  lines,
  stations,
  filteredLinesCode
}: {
  lines: IRailwayMapLine[]
  stations: IRailwayMapStation[]
  filteredLinesCode: string[]
}): React.ReactElement {
  const filteredLines = useMemo(
    () => lines.filter(line => filteredLinesCode.includes(line.id)),
    [lines, filteredLinesCode]
  )

  const filteredStations = useMemo(
    () =>
      stations.filter(station =>
        station.lines.some(line => filteredLinesCode.includes(line))
      ),
    [stations, filteredLinesCode]
  )

  const mapRef = useRef<HTMLDivElement>(null)

  // Use custom hook to handle all Leaflet rendering logic
  useEarthMapRenderer({
    mapRef,
    filteredLines,
    filteredStations,
    lines
  })

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

export default memo(EarthMap)
