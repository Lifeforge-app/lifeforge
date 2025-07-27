import L from 'leaflet'
import { type RefObject, useEffect, useRef } from 'react'

import type {
  RailwayMapLine,
  RailwayMapStation
} from '@apps/RailwayMap/providers/RailwayMapProvider'

import { initializeMap, renderLines, renderStations } from '../utils/mapUtils'

interface EarthMapRendererProps {
  mapRef: RefObject<HTMLDivElement | null>
  filteredLines: RailwayMapLine[]
  filteredStations: RailwayMapStation[]
  lines: RailwayMapLine[]
}

export const useEarthMapRenderer = ({
  mapRef,
  filteredLines,
  filteredStations,
  lines
}: EarthMapRendererProps) => {
  const mapInstanceRef = useRef<L.Map | null>(null)

  const polylineLayers = useRef<Record<string, L.Polyline>>({})

  const stationMarkers = useRef<Record<string, L.Marker>>({})

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = initializeMap(mapRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mapRef])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    renderLines(mapInstanceRef.current, filteredLines, polylineLayers.current)
  }, [filteredLines])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    renderStations(
      mapInstanceRef.current,
      filteredStations,
      lines,
      stationMarkers.current
    )
  }, [filteredStations, lines])
}
