import { useEffect } from 'react'

import type { Line, Station } from '../typescript/mrt.interfaces'

function useKeyboardEvents({
  selectedLineIndex,
  setMrtLines,
  setMrtStations,
  currentlyWorking
}: {
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  currentlyWorking: 'line' | 'station'
}) {
  useEffect(() => {
    document.body.onkeydown = e => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()

        if (currentlyWorking === 'line') {
          if (
            selectedLineIndex.index === null ||
            selectedLineIndex.type !== 'path_drawing'
          ) {
            return
          }

          setMrtLines(prevLines =>
            prevLines.map((line, index) => {
              if (
                index !== selectedLineIndex.index ||
                selectedLineIndex.type !== 'path_drawing'
              )
                return line

              const newPath = [...line.path]

              newPath.pop()

              return { ...line, path: newPath }
            })
          )
        } else {
          const confirm = window.confirm(
            'Are you sure you want to remove the last station? This action cannot be undone.'
          )

          if (!confirm) return

          setMrtStations(prevStations => {
            const newStations = [...prevStations]

            newStations.pop()

            return newStations
          })
        }
      }
    }
  }, [selectedLineIndex, currentlyWorking])
}

export default useKeyboardEvents
