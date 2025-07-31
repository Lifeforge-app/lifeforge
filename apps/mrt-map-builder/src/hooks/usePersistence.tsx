import { useEffect } from 'react'

import type { Line, Settings, Station } from '../typescript/mrt.interfaces'

function usePersistence({
  mrtLines,
  mrtStations,
  settings,
  selectedLineIndex
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  settings: Settings
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
}) {
  useEffect(() => {
    localStorage.setItem('mrtLines', JSON.stringify(mrtLines))
    localStorage.setItem('mrtStations', JSON.stringify(mrtStations))
    localStorage.setItem('settings', JSON.stringify(settings))
    localStorage.setItem(
      'mrtSelectedLineIndex',
      JSON.stringify(selectedLineIndex)
    )
  }, [mrtLines, mrtStations, settings, selectedLineIndex])
}

export default usePersistence
