/* eslint-disable react-compiler/react-compiler */
import { usePersonalization } from '@providers/PersonalizationProvider'
import * as d3 from 'd3'
import { useEffect, useMemo, useRef } from 'react'

import { useRailwayMapContext } from '../../../../../providers/RailwayMapProvider'
import {
  clearSelection,
  drawLines,
  drawStations,
  setupZooming,
  updateSelection
} from '../utils/renderUtils'

export const useRailwayMapRenderer = () => {
  const { derivedTheme, bgTempPalette } = usePersonalization()
  const {
    filteredLines: filteredLinesCode,
    lines,
    stations,
    shortestRoute,
    routeMapSVGRef: svgRef,
    routeMapGRef: gRef,
    selectedStation,
    setSelectedStation,
    centerStation
  } = useRailwayMapContext()

  const isInitializedRef = useRef(false)

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

  useEffect(() => {
    if (!svgRef.current || isInitializedRef.current || !centerStation) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g')
    gRef.current = g.node() as SVGGElement

    setupZooming(svg, g, centerStation)
    isInitializedRef.current = true

    return () => {
      svg.selectAll('*').remove()
      isInitializedRef.current = false
    }
  }, [svgRef, gRef, centerStation, shortestRoute])

  useEffect(() => {
    if (!gRef.current || !isInitializedRef.current) return

    const g = d3.select(gRef.current)
    g.selectAll('path').remove()

    drawLines(g, filteredLines, shortestRoute)
  }, [filteredLines, shortestRoute, centerStation])

  useEffect(() => {
    if (!gRef.current || !isInitializedRef.current) return

    const g = d3.select(gRef.current)
    g.selectAll('circle, rect, text').remove()

    drawStations(
      g,
      filteredStations,
      shortestRoute,
      lines,
      bgTempPalette,
      derivedTheme,
      selectedStation,
      setSelectedStation,
      svgRef,
      gRef,
      centerStation!
    )
  }, [filteredStations, shortestRoute, lines, bgTempPalette, centerStation])

  useEffect(() => {
    if (!gRef.current || !isInitializedRef.current) return

    const g = d3.select(gRef.current)

    try {
      if (selectedStation) {
        updateSelection(
          g,
          selectedStation,
          lines,
          bgTempPalette[derivedTheme === 'dark' ? 900 : 50]
        )
      } else {
        clearSelection(g, bgTempPalette[derivedTheme === 'dark' ? 900 : 50])
      }
    } catch (error) {
      console.error('Error updating station selection:', error)
    }
  }, [selectedStation, lines, centerStation, shortestRoute])
}
