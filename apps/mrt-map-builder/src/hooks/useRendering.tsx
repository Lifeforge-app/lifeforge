import * as d3 from 'd3'
import { useEffect } from 'react'
import { usePersonalization } from 'shared'
import { v4 } from 'uuid'

import type { Line, Settings, Station } from '../typescript/mrt.interfaces'
import roundedPolygon from '../utils/roundedPolygon'

function onStationClicked({
  mrtLines,
  mrtStations,
  selectedLineIndex,
  setMrtStations,
  station
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  station: Station
}) {
  if (
    selectedLineIndex.type !== 'station_plotting' ||
    selectedLineIndex.index === null
  ) {
    return
  }

  const lastStationOfLine =
    mrtStations
      .filter(s => s.lines.includes(mrtLines[selectedLineIndex.index!].name))
      .map(
        s =>
          s.codes
            ?.filter(c =>
              c.startsWith(mrtLines[selectedLineIndex.index!].code.slice(0, 2))
            )
            .map(c => parseInt(c.slice(2)) || 0) || []
      )
      .flat()
      .sort((a, b) => a - b)
      .pop() || 0

  setMrtStations(prevStations =>
    prevStations.map(s => {
      if (s.x === station.x && s.y === station.y) {
        return {
          ...s,
          codes: [
            ...(s.codes || []),
            `${mrtLines[selectedLineIndex.index!].code.slice(0, 2)}${lastStationOfLine + 1}`
          ]
        }
      }

      return s
    })
  )
}

function useRendering({
  gRef,
  mrtLines,
  mrtStations,
  settings,
  selectedLineIndex,
  currentlyWorking,
  setMrtStations
}: {
  gRef: React.RefObject<SVGGElement | null>
  mrtLines: Line[]
  mrtStations: Station[]
  settings: Settings
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
  currentlyWorking: 'line' | 'station'
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
}) {
  const { bgTempPalette } = usePersonalization()

  useEffect(() => {
    const g = d3.select(gRef.current)

    g.selectAll('*').remove()

    if (settings.showImage && settings.bgImagePreview) {
      g.append('svg:image')
        .attr('xlink:href', settings.bgImagePreview)
        .attr('width', `${settings.bgImageScale}%`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
    }

    for (let index = 0; index < mrtLines.length; index++) {
      const line = mrtLines[index]

      if (line.path.length === 0) continue

      const path = roundedPolygon(
        line.path.map(p => ({ x: p[0], y: p[1] })),
        5
      )

      g.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr(
          'stroke',
          selectedLineIndex.index === index &&
            selectedLineIndex.type === 'path_drawing'
            ? settings.colorOfCurrentLine
            : line.color
        )
        .attr('stroke-width', 5)
        .attr('stroke-linecap', 'round')
        .on('click', event => {
          event.stopPropagation()

          if (currentlyWorking !== 'station') return

          const [x, y] = d3.pointer(event, g.node())

          setMrtStations(prevStations => [
            ...prevStations,
            {
              id: v4(),
              x: Math.round(x),
              y: Math.round(y),
              name: '',
              type: 'station' as const,
              lines: [line.name],
              rotate: 0,
              width: 1,
              height: 1,
              textOffsetX: 0,
              textOffsetY: 0
            }
          ])
        })
    }

    for (const station of mrtStations) {
      if (station.type === 'interchange') {
        g.append('rect')
          .attr('x', station.x - 10)
          .attr('y', station.y - 10)
          .attr('width', 20 * (station.width || 1))
          .attr('height', 20 * (station.height || 1))
          .attr('fill', bgTempPalette[settings.darkMode ? 900 : 100])
          .attr('stroke', bgTempPalette[settings.darkMode ? 100 : 800])
          .attr('stroke-width', 3)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr(
            'transform',
            `rotate(${station.rotate}, ${station.x}, ${station.y})`
          )
          .on('click', () => {
            onStationClicked({
              mrtLines,
              mrtStations,
              selectedLineIndex,
              setMrtStations,
              station
            })
          })
      } else if (station.type === 'station') {
        g.append('circle')
          .attr('cx', station.x)
          .attr('cy', station.y)
          .attr('r', 6)
          .attr('fill', bgTempPalette[settings.darkMode ? 900 : 100])
          .attr(
            'stroke',
            mrtLines.find(l => l.name === station.lines?.[0])?.color ||
              bgTempPalette[settings.darkMode ? 100 : 800]
          )
          .attr('stroke-width', 2)
          .on('click', () => {
            onStationClicked({
              mrtLines,
              mrtStations,
              selectedLineIndex,
              setMrtStations,
              station
            })
          })
      }
      g.append('text')
        .attr(
          'x',
          station.x +
            (station.type === 'station' ? 0 : -10 + 10 * (station.width || 1))
        )
        .attr(
          'y',
          station.y +
            (station.type === 'station' ? 2 : -8 + 10 * (station.height || 1))
        )
        .attr('text-anchor', 'middle')
        .text(station.codes?.join(', ') || '')
        .attr('font-size', 5)
        .attr(
          'transform',
          `rotate(${station.rotate}, ${station.x}, ${station.y})`
        )
        .attr('fill', bgTempPalette[settings.darkMode ? 100 : 800])
        .attr('font-family', 'LTAIdentityMedium')

      g.append('text')
        .attr('x', station.x + (station.textOffsetX || 0))
        .attr('y', station.y + (station.textOffsetY || 0))
        .attr('text-anchor', 'middle')
        .attr('fill', bgTempPalette[settings.darkMode ? 100 : 800])
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('font-family', 'LTAIdentityMedium')
        .attr('white-space', 'pre')
        .attr('style', 'line-height: 1.2')
        .each(function () {
          const textElement = d3.select(this)

          const lines = station.name.split('\\n')

          lines.forEach((line: string, i: number) => {
            textElement
              .append('tspan')
              .attr('x', station.x + (station.textOffsetX || 0))
              .attr('dy', i === 0 ? '0em' : '1.2em')
              .text(line)
          })
        })
    }
  }, [mrtLines, mrtStations, settings, selectedLineIndex, currentlyWorking])
}

export default useRendering
