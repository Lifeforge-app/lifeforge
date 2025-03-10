import clsx from 'clsx'
import React, { useEffect, useMemo, useRef } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { useRailwayMapRenderer } from './hooks/useRailwayMapRenderer'

function RouteMap({
  stations,
  lines,
  filteredLinesCode,
  shortestRoute
}: {
  stations: IRailwayMapStation[]
  lines: IRailwayMapLine[]
  filteredLinesCode: string[]
  shortestRoute: IRailwayMapStation[]
}): React.ReactElement {
  const { bgTemp, componentBg } = useThemeColors()
  const svgRef = useRef<SVGSVGElement>(null)

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

  // Use custom hook to handle all D3 rendering logic
  useRailwayMapRenderer({
    svgRef,
    filteredLines,
    filteredStations,
    shortestRoute,
    lines,
    bgTemp
  })

  return (
    <div className="mt-6 w-full flex-1 pb-8">
      <div
        className={clsx('shadow-custom h-full w-full rounded-lg', componentBg)}
      >
        <svg ref={svgRef} height="100%" width="100%"></svg>
      </div>
    </div>
  )
}

export default RouteMap
