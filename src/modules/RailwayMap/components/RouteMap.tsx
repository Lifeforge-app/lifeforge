import * as d3 from 'd3'
import React, { useEffect, useMemo, useRef } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'

const roundedPolygon = (points: { x: number; y: number }[], radius: number) => {
  const qb = []
  for (let index = 0; index < points.length; index++) {
    const first = points[index]
    const second = points[(index + 1) % points.length]
    const distance = Math.hypot(first.x - second.x, first.y - second.y)
    const ratio = radius / distance
    const dx = (second.x - first.x) * ratio
    const dy = (second.y - first.y) * ratio
    qb.push({ x: first.x + dx, y: first.y + dy })
    qb.push({ x: second.x - dx, y: second.y - dy })
  }

  let path = `M ${qb[0].x}, ${qb[0].y} L ${qb[1].x}, ${qb[1].y}`
  for (let index = 1; index < points.length; index++) {
    path += ` Q ${points[index].x},${points[index].y} ${qb[index * 2].x}, ${
      qb[index * 2].y
    }`
    path += ` L ${qb[index * 2 + 1].x}, ${qb[index * 2 + 1].y}`
  }
  path += ` Q ${points[0].x},${points[0].y} ${qb[0].x}, ${qb[0].y} Z`
  return path
}

function RouteMap({
  stations,
  lines,
  filteredLinesCode
}: {
  stations: IRailwayMapStation[]
  lines: IRailwayMapLine[]
  filteredLinesCode: string[]
}): React.ReactElement {
  const { bgTemp } = useThemeColors()

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
    const svg = d3.select(ref.current)

    // 清除之前的内容，防止重复绘制
    svg.selectAll('*').remove()

    const g = svg.append('g')

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3]) // 限制缩放范围（最小 0.5x，最大 3x）
      .on('zoom', event => {
        g.attr('transform', event.transform) // 让整个地图变换
      })

    //@ts-expect-error - don't know how to fix this lol
    svg.call(zoom) // 绑定缩放行为
    //@ts-expect-error - don't know how to fix this lol
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.8)) // 默认缩放到 0.5x

    for (const line of filteredLines) {
      for (const pathGroups of line.map_paths) {
        const path = roundedPolygon(
          pathGroups.map(p => ({ x: p[0], y: p[1] })),
          5
        )

        g.append('path')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', line.color)
          .attr('stroke-width', 5)
          .attr('stroke-linecap', 'round')
      }
    }

    for (const station of filteredStations) {
      if (!station.map_data) continue

      if (station.type === 'interchange') {
        g.append('rect')
          .attr('x', station.map_data.x - 10)
          .attr('y', station.map_data.y - 10)
          .attr('width', 20)
          .attr('height', 20 * station.map_data.width)
          .attr('fill', bgTemp[950])
          .attr('stroke', bgTemp[200])
          .attr('stroke-width', 3)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('cursor', 'pointer')
          .attr(
            'transform',
            `rotate(${station.map_data.rotate}, ${station.map_data.x}, ${station.map_data.y})`
          )

        // draw text
      } else if (station.type === 'station') {
        const stationCode = station.codes[0]
        const line = lines.find(
          l =>
            stationCode.startsWith(l.code.slice(0, 2)) ||
            (l.code === 'EWL' && stationCode.startsWith('CG')) ||
            (l.code === 'CCL' && stationCode.startsWith('CE')) ||
            (l.code === 'DTL' && stationCode.startsWith('DE')) ||
            (l.code === 'JRL' && ['JW', 'JS'].includes(stationCode.slice(0, 2)))
        )

        g.append('circle')
          .attr('cx', station.map_data.x)
          .attr('cy', station.map_data.y)
          .attr('r', 6)
          .attr('fill', bgTemp[950])
          .attr('stroke', line ? line.color : 'black')
          .attr('stroke-width', 2)
          .attr('cursor', 'pointer')
          .attr('onclick', `alert('${station.map_data.text}')`)
      }

      g.append('text')
        .attr('x', station.map_data.x + (station.map_data.textOffsetX || 0))
        .attr('y', station.map_data.y + (station.map_data.textOffsetY || 0))
        .attr('fill', bgTemp[200])
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('font-family', 'LTAIdentityMedium')
        .each(function () {
          const textElement = d3.select(this)
          const lines = station.map_data.text.split('\n') // 🚀 按换行符拆分文本

          lines.forEach((line, i) => {
            textElement
              .append('tspan')
              .attr(
                'x',
                station.map_data.x + (station.map_data.textOffsetX || 0)
              ) // 保持对齐
              .attr('dy', i === 0 ? '0em' : '1.2em') // 控制行间距
              .text(line)
          })
        })
    }
  }, [lines, filteredLines, filteredStations, stations])

  const ref = useRef<SVGSVGElement>(null)
  return (
    <div className="w-full mt-6 flex-1">
      <svg ref={ref} height="100%" width="100%"></svg>
    </div>
  )
}

export default RouteMap
