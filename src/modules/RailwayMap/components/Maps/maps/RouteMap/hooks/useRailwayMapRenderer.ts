import * as d3 from 'd3'
import { useEffect, RefObject } from 'react'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { setupZooming, drawLines, drawStations } from '../utils/renderUtils'

interface RailwayMapRendererProps {
  svgRef: RefObject<SVGSVGElement | null>
  filteredLines: IRailwayMapLine[]
  filteredStations: IRailwayMapStation[]
  shortestRoute: IRailwayMapStation[]
  lines: IRailwayMapLine[]
  bgTemp: { [key: number]: string }
}

export const useRailwayMapRenderer = ({
  svgRef,
  filteredLines,
  filteredStations,
  shortestRoute,
  lines,
  bgTemp
}: RailwayMapRendererProps): void => {
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g')

    setupZooming(svg, g)
    drawLines(g, filteredLines, shortestRoute)
    drawStations(g, filteredStations, shortestRoute, lines, bgTemp)
  }, [svgRef, filteredLines, filteredStations, shortestRoute, lines, bgTemp])
}
