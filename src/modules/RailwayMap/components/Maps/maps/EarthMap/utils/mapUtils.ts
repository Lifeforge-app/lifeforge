import L from 'leaflet'

import {
  IRailwayMapLine,
  IRailwayMapStation
} from '@modules/RailwayMap/interfaces/railway_map_interfaces'

export const initializeMap = (element: HTMLDivElement): L.Map => {
  const map = L.map(element).setView([1.3521, 103.8198], 12)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    minZoom: 11
  }).addTo(map)

  return map
}

export const renderLines = (
  map: L.Map,
  filteredLines: IRailwayMapLine[],
  polylineLayers: Record<string, L.Polyline>
) => {
  Object.keys(polylineLayers).forEach(id => {
    const lineExists = filteredLines.some(line => line.id === id)
    if (!lineExists) {
      map.removeLayer(polylineLayers[id])
      delete polylineLayers[id]
    }
  })

  filteredLines.forEach(line => {
    if (polylineLayers[line.id]) {
      map.removeLayer(polylineLayers[line.id])
    }

    const polyline = L.polyline(line.ways, {
      color: line.color
    }).addTo(map)

    polylineLayers[line.id] = polyline
  })
}

export const getLineForStationCode = (
  code: string,
  station: IRailwayMapStation,
  lines: IRailwayMapLine[]
): IRailwayMapLine | undefined => {
  const targetLine = station.lines.find(line => {
    const lineData = lines.find(l => l.id === line)!
    if (lineData.type === 'MRT') {
      return (
        code.startsWith(lineData.code.slice(0, 2)) ||
        (lineData.code === 'EWL' && code.startsWith('CG')) ||
        (lineData.code === 'CCL' && code.startsWith('CE')) ||
        (lineData.code === 'DTL' && code.startsWith('DE')) ||
        (lineData.code === 'JRL' && ['JW', 'JS'].includes(code.slice(0, 2)))
      )
    }

    const LRT_CORRESPONDENCE = {
      'Bukit Panjang Line': ['BP'],
      'Sengkang Line': ['SE', 'SW', 'STC'],
      'Punggol Line': ['PE', 'PW', 'PTC']
    }

    return (
      LRT_CORRESPONDENCE[
        lineData.name as keyof typeof LRT_CORRESPONDENCE
      ]?.some(lrtCode => code.startsWith(lrtCode)) || false
    )
  })

  if (!targetLine) return undefined
  return lines.find(line => line.id === targetLine)
}

export const createStationMarkerContent = (
  station: IRailwayMapStation,
  lines: IRailwayMapLine[]
): HTMLDivElement => {
  const stationHtml = document.createElement('div')
  stationHtml.className = 'rounded-md'

  if (station.codes.length > 0) {
    station.codes.forEach((code, index) => {
      const stationCode = document.createElement('span')
      stationCode.className = `text-xs font-['LTAIdentityMedium'] font-semibold text-bg-100 bg-gray-800 px-2 py-0.5 ${
        index === 0 ? 'rounded-l-full' : ''
      } ${index === station.codes.length - 1 ? 'rounded-r-full' : ''}`

      const targetLine = getLineForStationCode(code, station, lines)
      stationCode.style.backgroundColor = targetLine ? targetLine.color : '#333'
      stationCode.textContent = code
      stationHtml.appendChild(stationCode)
    })
  }

  return stationHtml
}

export const renderStations = (
  map: L.Map,
  filteredStations: IRailwayMapStation[],
  lines: IRailwayMapLine[],
  stationMarkers: Record<string, L.Marker>
) => {
  Object.keys(stationMarkers).forEach(id => {
    const stationExists = filteredStations.some(station => station.id === id)
    if (!stationExists) {
      map.removeLayer(stationMarkers[id])
      delete stationMarkers[id]
    }
  })

  filteredStations.forEach(station => {
    if (stationMarkers[station.id]) {
      map.removeLayer(stationMarkers[station.id])
    }

    const stationHtml = createStationMarkerContent(station, lines)

    const tooltipContent = `
      <div>
        <strong>${station.name}</strong><br/>
        ${station.codes.join(', ')}
      </div>
    `

    const marker = L.marker(station.coords, {
      icon: L.divIcon({
        html: stationHtml,
        className: 'station-marker-container',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(map)

    marker.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      offset: L.point(0, -10)
    })

    stationMarkers[station.id] = marker
  })
}
