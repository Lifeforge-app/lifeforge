import * as d3 from 'd3'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { roundedPolygon } from './geometryUtils'

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

export const drawInterchange = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: IRailwayMapStation,
  stroke: string,
  fill: string
) => {
  const attributes = {
    x: station.map_data.x - 10,
    y: station.map_data.y - 10,
    width: 20,
    height: 20 * station.map_data.width,
    fill,
    stroke,
    'stroke-width': 3,
    rx: 10,
    ry: 10,
    cursor: 'pointer',
    transform: `rotate(${station.map_data.rotate}, ${station.map_data.x}, ${station.map_data.y})`
  }

  const item = g.append('rect')
  Object.entries(attributes).forEach(([key, value]) => {
    item.attr(key, value)
  })
}

export const drawStation = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: IRailwayMapStation,
  stroke: string,
  fill: string
) => {
  const attributes = {
    cx: station.map_data.x,
    cy: station.map_data.y,
    r: 6,
    fill,
    stroke,
    'stroke-width': 2,
    cursor: 'pointer',
    onclick: `alert('${station.map_data.text}')`
  }

  const item = g.append('circle')
  Object.entries(attributes).forEach(([key, value]) => {
    item.attr(key, value)
  })
}

export const drawText = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: IRailwayMapStation,
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

      lines.forEach((line, i) => {
        textElement
          .append('tspan')
          .attr('x', station.map_data.x + (station.map_data.textOffsetX || 0))
          .attr('dy', i === 0 ? '0em' : '1.2em')
          .text(line)
      })
    })
}

export const ignoreStation = (
  station: IRailwayMapStation,
  shortestRoute: IRailwayMapStation[]
) => {
  return (
    !station.map_data ||
    (shortestRoute.length !== 0 &&
      !shortestRoute.some(s => s.id === station.id))
  )
}

export const drawStations = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredStations: IRailwayMapStation[],
  shortestRoute: IRailwayMapStation[],
  lines: IRailwayMapLine[],
  bgTemp: { [key: number]: string }
) => {
  filteredStations.forEach(station => {
    if (ignoreStation(station, shortestRoute)) return

    drawText(g, station, bgTemp[200])

    if (station.type === 'interchange') {
      drawInterchange(
        g,
        station,
        bgTemp[200],
        shortestRoute.some(s => s.id === station.id) ? bgTemp[200] : bgTemp[950]
      )
      return
    }

    const line = getLine(station, lines)
    const isInRoute = shortestRoute.some(s => s.id === station.id)
    const fill = isInRoute ? (line ? line.color : bgTemp[200]) : bgTemp[950]

    drawStation(g, station, line ? line.color : 'black', fill)
  })
}

export const ignoreLine = (
  line: IRailwayMapLine,
  shortestRoute: IRailwayMapStation[]
) => {
  return (
    shortestRoute.length !== 0 &&
    !shortestRoute
      .filter(e => e.type === 'station')
      .some(s => s.lines.includes(line.id))
  )
}

export const drawLines = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredLines: IRailwayMapLine[],
  shortestRoute: IRailwayMapStation[]
) => {
  filteredLines.forEach(line => {
    if (ignoreLine(line, shortestRoute)) return

    line.map_paths.forEach(pathGroups => {
      const path = roundedPolygon(
        pathGroups.map(p => ({ x: p[0], y: p[1] })),
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

export const setupZooming = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  g: d3.Selection<SVGGElement, unknown, null, undefined>
) => {
  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', event => {
      g.attr('transform', event.transform)
    })

  svg.call(
    zoom as unknown as (
      selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => void
  )
  svg.call(
    zoom.transform as unknown as (
      selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      transform: d3.ZoomTransform
    ) => void,
    d3.zoomIdentity.scale(0.8)
  )
}
