import * as d3 from 'd3'
import { useEffect } from 'react'

import type { Line } from '../typescript/mrt.interfaces'

function useCanvasEvents({
  ref,
  gRef,
  selectedLineIndexRef,
  setMrtLines,
  currentWorkingRef
}: {
  ref: React.RefObject<SVGSVGElement | null>
  gRef: React.RefObject<SVGGElement | null>
  selectedLineIndexRef: React.RefObject<{
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }>
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  currentWorkingRef: React.MutableRefObject<'line' | 'station'>
}) {
  useEffect(() => {
    const svg = d3.select(ref.current)

    const g = d3.select(gRef.current)

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.4, 4])
        .on('zoom', event => {
          g.attr('transform', event.transform)
        }) as never
    )

    svg.on('click', function (event) {
      if (event.defaultPrevented) return

      const [x, y] = d3.pointer(event, g.node())

      if (currentWorkingRef.current !== 'line') return

      if (
        selectedLineIndexRef.current.index === null ||
        selectedLineIndexRef.current.type !== 'path_drawing'
      ) {
        return
      }

      setMrtLines(prevLines =>
        prevLines.map((line, index) => {
          if (
            index !== selectedLineIndexRef.current.index &&
            selectedLineIndexRef.current.type !== 'path_drawing'
          )
            return line

          return {
            ...line,
            path: [...line.path, [Math.round(x), Math.round(y)]]
          }
        })
      )
    })
  }, [])
}

export default useCanvasEvents
