import 'leaflet/dist/leaflet.css'
import { memo, useMemo, useRef } from 'react'

import { useRailwayMapContext } from '../../../../providers/RailwayMapProvider'
import { useEarthMapRenderer } from './hooks/useEarthMapRenderer'

function EarthMap() {
  const {
    lines,
    stations,
    filteredLines: filteredLinesCode
  } = useRailwayMapContext()

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

  useEarthMapRenderer({
    mapRef,
    filteredLines,
    filteredStations,
    lines
  })

  return (
    <div className="flex-1 overflow-hidden py-8">
      <div className="shadow-custom h-full w-full overflow-hidden rounded-lg">
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  )
}

export default memo(EarthMap)
