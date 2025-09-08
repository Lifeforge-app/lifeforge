import * as d3 from 'd3'

import type {
  RailwayMapLine,
  RailwayMapStation
} from '@apps/06.Information/railwayMap/providers/RailwayMapProvider'

import { getLine } from './stationUtils'

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
  selectedStation: RailwayMapStation,
  lines: RailwayMapLine[],
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
