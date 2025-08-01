import * as d3 from 'd3'

import type {
  RailwayMapLine,
  RailwayMapStation
} from '@apps/RailwayMap/providers/RailwayMapProvider'

import { roundedPolygon } from './geometryUtils'
import { getLinesRequired } from './routeUtils'
import { type RouteData, getLine, ignoreStation } from './stationUtils'
import { centerMapOnStation } from './zoomUtils'

export type StationSelectionCallback = (
  station: RailwayMapStation | null
) => void

export type Theme = 'light' | 'dark'

export type ColorMap = { [key: number]: string }

export const addStationInteraction = (
  element: d3.Selection<any, unknown, null, undefined>,
  station: RailwayMapStation,
  setSelectedStation: StationSelectionCallback,
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  centerStation: RailwayMapStation
) => {
  element.on('click', () => {
    setSelectedStation(station)
    centerMapOnStation(svgRef, gRef, station, centerStation, 2, 1000, false)
  })
}

export const drawText = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: RailwayMapStation,
  fill: string
) => {
  g.append('text')
    .attr('x', station.map_data.x + (station.map_data.textOffsetX || 0))
    .attr('y', station.map_data.y + (station.map_data.textOffsetY || 0))
    .attr('fill', fill)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 10)
    .attr('font-family', 'LTAIdentityMedium')
    .each(function () {
      const textElement = d3.select(this)

      const lines = station.map_data.text.split('\n')

      lines.forEach((line: string, i: number) => {
        textElement
          .append('tspan')
          .attr('x', station.map_data.x + (station.map_data.textOffsetX || 0))
          .attr('dy', i === 0 ? '0em' : '1.2em')
          .text(line)
      })
    })
}

export const drawInterchange = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: RailwayMapStation,
  stroke: string,
  fill: string,
  isSelected: boolean,
  setSelectedStation: StationSelectionCallback,
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  centerStation: RailwayMapStation
) => {
  const attributes = {
    id: `station-${station.id}`,
    class: 'interchange',
    x: station.map_data.x - 10,
    y: station.map_data.y - 10,
    width: 20,
    height: 20 * station.map_data.width,
    fill,
    stroke,
    'stroke-width': isSelected ? 5 : 3,
    rx: 10,
    ry: 10,
    cursor: 'pointer',
    transform: `rotate(${station.map_data.rotate}, ${station.map_data.x}, ${station.map_data.y})`
  }

  const item = g.append('rect')

  Object.entries(attributes).forEach(([key, value]) => {
    item.attr(key, value)
  })

  addStationInteraction(
    item,
    station,
    setSelectedStation,
    svgRef,
    gRef,
    centerStation
  )

  item.on('mouseenter', () => {
    item
      .transition()
      .duration(100)
      .attr('stroke-width', 5)
      .attr('width', 24)
      .attr('height', 24 * station.map_data.width)
      .attr('x', station.map_data.x - 12)
      .attr('y', station.map_data.y - 12)
      .attr('rx', 12)
      .attr('ry', 12)
  })

  item.on('mouseleave', () => {
    item
      .transition()
      .duration(100)
      .attr('stroke-width', isSelected ? 5 : 3)
      .attr('width', 20)
      .attr('height', 20 * station.map_data.width)
      .attr('x', station.map_data.x - 10)
      .attr('y', station.map_data.y - 10)
      .attr('rx', 10)
      .attr('ry', 10)
  })
}

export const drawStation = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: RailwayMapStation,
  stroke: string,
  fill: string,
  isSelected: boolean,
  setSelectedStation: StationSelectionCallback,
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  centerStation: RailwayMapStation
) => {
  const attributes = {
    id: `station-${station.id}`,
    class: 'station',
    cx: station.map_data.x,
    cy: station.map_data.y,
    r: 6,
    fill,
    stroke,
    'stroke-width': isSelected ? 5 : 2,
    cursor: 'pointer'
  }

  const item = g.append('circle')

  Object.entries(attributes).forEach(([key, value]) => {
    item.attr(key, value)
  })

  addStationInteraction(
    item,
    station,
    setSelectedStation,
    svgRef,
    gRef,
    centerStation
  )

  item.on('mouseenter', () => {
    item.transition().duration(100).attr('r', 8).attr('stroke-width', 5)
  })

  item.on('mouseleave', () => {
    item
      .transition()
      .duration(100)
      .attr('r', 6)
      .attr('stroke-width', isSelected ? 5 : 2)
  })
}

export const drawStations = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredStations: RailwayMapStation[],
  shortestRoute: RouteData,
  lines: RailwayMapLine[],
  bgTemp: ColorMap,
  finalTheme: Theme,
  selectedStation: RailwayMapStation | null,
  setSelectedStation: StationSelectionCallback,
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  centerStation: RailwayMapStation
) => {
  filteredStations.forEach(station => {
    if (ignoreStation(station, shortestRoute)) return

    const isSelected = station.id === selectedStation?.id

    const isInRoute =
      typeof shortestRoute !== 'string'
        ? shortestRoute.some(s => s.id === station.id)
        : false

    const textColor = bgTemp[finalTheme === 'dark' ? 200 : 800]

    drawText(g, station, textColor)

    const line = getLine(station, lines)

    const fill = (() => {
      if (isInRoute || isSelected) {
        return line ? line.color : bgTemp[200]
      }

      return bgTemp[finalTheme === 'dark' ? 900 : 100]
    })()

    if (station.type === 'interchange') {
      drawInterchange(
        g,
        station,
        textColor,
        fill,
        isSelected,
        setSelectedStation,
        svgRef,
        gRef,
        centerStation
      )

      return
    }

    drawStation(
      g,
      station,
      line ? line.color : 'black',
      fill,
      isSelected,
      setSelectedStation,
      svgRef,
      gRef,
      centerStation
    )
  })
}

export const drawLines = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredLines: RailwayMapLine[],
  shortestRoute: RouteData
) => {
  filteredLines.forEach(line => {
    if (typeof shortestRoute !== 'string' && shortestRoute.length > 0) {
      const linesRequired = getLinesRequired(shortestRoute)

      if (!linesRequired.includes(line.id)) return
    }

    line.map_paths.forEach((pathGroups: string[]) => {
      const path = roundedPolygon(
        pathGroups.map(p => ({ x: parseInt(p[0]), y: parseInt(p[1]) })),
        5
      )

      const attributes = {
        d: path,
        fill: 'none',
        stroke: line.color,
        'stroke-width': 5,
        'stroke-linecap': 'round'
      }

      const item = g.append('path')

      Object.entries(attributes).forEach(([key, value]) => {
        item.attr(key, value)
      })
    })
  })
}
