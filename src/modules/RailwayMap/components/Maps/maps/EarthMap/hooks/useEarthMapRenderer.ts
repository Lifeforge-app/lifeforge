import L from 'leaflet'
import { useEffect, RefObject, useRef } from 'react'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'
import { initializeMap, renderLines, renderStations } from '../utils/mapUtils'

interface EarthMapRendererProps {
  mapRef: RefObject<HTMLDivElement | null>
  filteredLines: IRailwayMapLine[]
  filteredStations: IRailwayMapStation[]
  lines: IRailwayMapLine[]
}

export const useEarthMapRenderer = ({
  mapRef,
  filteredLines,
  filteredStations,
  lines
}: EarthMapRendererProps): void => {
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
