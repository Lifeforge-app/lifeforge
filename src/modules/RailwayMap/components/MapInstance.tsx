import L from 'leaflet'
import React, { memo, useRef, useEffect, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@interfaces/railway_map_interfaces'

function MapInstance({
  lines,
  stations,
  filteredLinesCode
}: {
  lines: IRailwayMapLine[]
  stations: IRailwayMapStation[]
  filteredLinesCode: string[]
}): React.ReactElement {
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
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const polylineLayers = useRef<Record<string, L.Polyline>>({})
  const stationMarkers = useRef<Record<string, L.Marker>>({})

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [1.3521, 103.8198],
        12
      )

      // Add tile layer
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          minZoom: 11
        }
      ).addTo(mapInstanceRef.current)
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Empty dependency array ensures this runs only once

  // Handle polylines separately - will run only when lines change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current

    // Remove polylines that are no longer in the lines array
    Object.keys(polylineLayers.current).forEach(id => {
      const lineExists = filteredLines.some(line => line.id === id)
      if (!lineExists) {
        map.removeLayer(polylineLayers.current[id])
        delete polylineLayers.current[id]
      }
    })

    // Add or update polylines
    filteredLines.forEach(line => {
      // If polyline exists, remove it first
      if (polylineLayers.current[line.id]) {
        map.removeLayer(polylineLayers.current[line.id])
      }

      // Create new polyline
      const polyline = L.polyline(line.ways, {
        color: line.color
      }).addTo(map)

      // Store reference to the polyline
      polylineLayers.current[line.id] = polyline
    })
  }, [filteredLines, lines])

  // Handle station markers - will run only when stations change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current

    // Remove markers that are no longer in the stations array
    Object.keys(stationMarkers.current).forEach(id => {
      const stationExists = filteredStations.some(station => station.id === id)
      if (!stationExists) {
        map.removeLayer(stationMarkers.current[id])
        delete stationMarkers.current[id]
      }
    })

    // Add or update station markers
    filteredStations.forEach(station => {
      // If marker exists, remove it first
      if (stationMarkers.current[station.id]) {
        map.removeLayer(stationMarkers.current[station.id])
      }

      // Create station marker for each coordinate point
      const stationHtml = document.createElement('div')
      stationHtml.className = 'rounded-md'

      // Add the first station code to the marker
      if (station.codes.length > 0) {
        station.codes.forEach((code, index) => {
          const stationCode = document.createElement('span')
          stationCode.className = `text-xs font-['LTAIdentityMedium'] font-semibold text-bg-100 bg-gray-800 px-2 py-0.5 ${
            index === 0 ? 'rounded-l-full' : ''
          }
                ${index === station.codes.length - 1 ? 'rounded-r-full' : ''}`

          const targetLine = station.lines.find(line => {
            const lineData = lines.find(l => l.id === line)!
            if (lineData.type === 'MRT') {
              return (
                code.startsWith(lineData.code.slice(0, 2)) ||
                (lineData.code === 'EWL' && code.startsWith('CG')) ||
                (lineData.code === 'CCL' && code.startsWith('CE')) ||
                (lineData.code === 'DTL' && code.startsWith('DE')) ||
                (lineData.code === 'JRL' &&
                  ['JW', 'JS'].includes(code.slice(0, 2)))
              )
            }

            const LRT_CORRESPONDENCE = {
              'Bukit Panjang Line': ['BP'],
              'Sengkang Line': ['SE', 'SW', 'STC'],
              'Punggol Line': ['PE', 'PW', 'PTC']
            }

            return LRT_CORRESPONDENCE[
              lineData.name as keyof typeof LRT_CORRESPONDENCE
            ].some(lrtCode => code.startsWith(lrtCode))
          })

          stationCode.style.backgroundColor = targetLine
            ? lines.find(line => line.id === targetLine)!.color
            : '#333'

          stationCode.textContent = code
          stationHtml.appendChild(stationCode)
        })
      }

      // Create tooltip content with station name and all codes
      const tooltipContent = `
          <div>
            <strong>${station.name}</strong><br/>
            ${station.codes.join(', ')}
          </div>
        `

      // Create marker with custom icon
      const marker = L.marker(station.coords, {
        icon: L.divIcon({
          html: stationHtml,
          className: 'station-marker-container',
          iconSize: [24, 24], // Increased size to match the div
          iconAnchor: [12, 12] // Updated anchor point to center
        })
      }).addTo(map)

      // Add tooltip to the marker
      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        offset: L.point(0, -10)
      })

      // Store reference to the marker
      stationMarkers.current[station.id] = marker
    })
  }, [stations, filteredStations, lines])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

export default memo(MapInstance)
