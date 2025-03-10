import * as d3 from 'd3'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { roundedPolygon } from './geometryUtils'

let zoomBehavior: d3.ZoomBehavior<Element, unknown>

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

export const clearSelection = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  initialFill: string
) => {
  const elements = g.selectAll('circle, rect')
  if (elements.empty()) return

  elements
    .transition()
    .duration(100)
    .attr('stroke-width', function () {
      return d3.select(this).classed('interchange') ? 3 : 2
    })
    .attr('fill', initialFill)
}

export const updateSelection = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  selectedStation: IRailwayMapStation,
  lines: IRailwayMapLine[],
  initialFill: string
) => {
  clearSelection(g, initialFill)

  const stationElement = g.select(`#station-${selectedStation.id}`)
  if (stationElement.empty()) return

  stationElement.transition().duration(100).attr('stroke-width', 5)

  if (selectedStation.type === 'interchange') {
    stationElement
      .transition()
      .duration(100)
      .attr('fill', function () {
        return d3.select(this).attr('stroke')
      })
  } else {
    const line = getLine(selectedStation, lines)
    stationElement
      .transition()
      .duration(100)
      .attr('fill', line ? line.color : '#fff')
  }
}

export const drawInterchange = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: IRailwayMapStation,
  stroke: string,
  fill: string,
  isSelected: boolean,
  setSelectedStation: (station: IRailwayMapStation | null) => void
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

  item.on('click', () => {
    setSelectedStation(station)
  })
}

export const drawStation = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  station: IRailwayMapStation,
  stroke: string,
  fill: string,
  isSelected: boolean,
  setSelectedStation: (station: IRailwayMapStation | null) => void
) => {
  const attributes = {
    id: `station-${station.id}`,
    class: 'station', // Add class for easier selection
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

  item.on('click', () => {
    setSelectedStation(station)
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
  shortestRoute: IRailwayMapStation[] | 'loading' | 'error'
) => {
  return (
    !station.map_data ||
    (typeof shortestRoute !== 'string' &&
      shortestRoute.length > 0 &&
      !shortestRoute.some(s => s.id === station.id))
  )
}

export const drawStations = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredStations: IRailwayMapStation[],
  shortestRoute: IRailwayMapStation[] | 'loading' | 'error',
  lines: IRailwayMapLine[],
  bgTemp: { [key: number]: string },
  finalTheme: 'light' | 'dark',
  selectedStation: IRailwayMapStation | null,
  setSelectedStation: (station: IRailwayMapStation | null) => void
) => {
  filteredStations.forEach(station => {
    if (ignoreStation(station, shortestRoute)) return

    const isSelected = station.id === selectedStation?.id
    const isInRoute =
      typeof shortestRoute !== 'string'
        ? shortestRoute.some(s => s.id === station.id)
        : false

    drawText(g, station, bgTemp[finalTheme === 'dark' ? 200 : 800])

    if (station.type === 'interchange') {
      drawInterchange(
        g,
        station,
        bgTemp[finalTheme === 'dark' ? 200 : 800],
        isInRoute || isSelected
          ? bgTemp[200]
          : bgTemp[finalTheme === 'dark' ? 900 : 100],
        isSelected,
        setSelectedStation
      )
      return
    }

    const line = getLine(station, lines)
    const fill =
      isInRoute || isSelected
        ? line
          ? line.color
          : bgTemp[200]
        : bgTemp[finalTheme === 'dark' ? 900 : 100]

    drawStation(
      g,
      station,
      line ? line.color : 'black',
      fill,
      isSelected,
      setSelectedStation
    )
  })
}

const getConsecutiveLine = (
  station: IRailwayMapStation,
  lastStation: IRailwayMapStation
): string => {
  const stationLines = station.lines
  const lastStationLines = lastStation.lines

  return [...new Set([...stationLines, ...lastStationLines])].find(
    line => stationLines.includes(line) && lastStationLines.includes(line)
  ) as string
}

const getLinesRequired = (shortestRoute: IRailwayMapStation[]) => {
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

export const drawLines = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filteredLines: IRailwayMapLine[],
  shortestRoute: IRailwayMapStation[] | 'loading' | 'error'
) => {
  filteredLines.forEach(line => {
    if (typeof shortestRoute !== 'string' && shortestRoute.length > 0) {
      const linesRequired = getLinesRequired(shortestRoute)

      if (!linesRequired.includes(line.id)) return
    }

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
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  centerStation: IRailwayMapStation
) => {
  const svgNode = svg.node()
  if (!svgNode) return

  const width = svgNode.getBoundingClientRect().width
  const height = svgNode.getBoundingClientRect().height

  const centerX = centerStation.map_data.x
  const centerY = centerStation.map_data.y

  const initialScale = window.innerWidth < 1280 ? 0.5 : 0.7
  const centerTx = width / 2 - centerX * initialScale
  const centerTy = height / 2 - centerY * initialScale

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', event => {
      g.attr('transform', event.transform)
    })

  svg.call(
    zoomBehavior as unknown as (
      selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => void
  )
  svg.call(
    zoomBehavior.transform as unknown as (
      selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      transform: d3.ZoomTransform
    ) => void,
    d3.zoomIdentity.scale(initialScale).translate(centerTx, centerTy)
  )

  g.attr(
    'transform',
    `translate(${centerTx}, ${centerTy}) scale(${initialScale})`
  )
}

export const centerMapOnStation = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  station: IRailwayMapStation,
  centerStation: IRailwayMapStation,
  scale = 2,
  duration = 1000,
  needZoom = true
) => {
  if (!station.map_data || !svgRef.current || !gRef.current) return

  const svg = d3.select(svgRef.current)
  const g = d3.select(gRef.current)

  if (svg.empty() || g.empty()) return

  const x = station.map_data.x
  const y = station.map_data.y

  const centerX = centerStation.map_data.x
  const centerY = centerStation.map_data.y

  const svgNode = svg.node()
  if (!svgNode) return

  const width = svgNode.getBoundingClientRect().width
  const height = svgNode.getBoundingClientRect().height

  const initialScale = window.innerWidth < 1280 ? 0.5 : 0.7
  const centerTx = width / 2 - centerX * initialScale
  const centerTy = height / 2 - centerY * initialScale

  const targetTx = width / 2 - x * scale
  const targetTy = height / 2 - y * scale

  if (needZoom) {
    svg
      .transition()
      .duration(duration / 2)
      .call(
        zoomBehavior.transform as unknown as (
          transition: d3.Transition<SVGSVGElement, unknown, null, undefined>,
          ...args: any[]
        ) => void,
        d3.zoomIdentity.translate(centerTx, centerTy).scale(initialScale)
      )

    g.transition()
      .duration(duration / 2)
      .attr(
        'transform',
        `translate(${centerTx}, ${centerTy}) scale(${initialScale})`
      )
  }

  setTimeout(
    () => {
      svg
        .transition()
        .duration(duration)
        .call(
          zoomBehavior.transform as unknown as (
            transition: d3.Transition<SVGSVGElement, unknown, null, undefined>,
            ...args: any[]
          ) => void,
          d3.zoomIdentity.translate(targetTx, targetTy).scale(scale)
        )

      g.transition()
        .duration(duration)
        .attr(
          'transform',
          `translate(${targetTx}, ${targetTy}) scale(${scale})`
        )
    },
    needZoom ? duration / 2 : 0
  )
}
