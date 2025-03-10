import React from 'react'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import EarthMap from './maps/EarthMap'
import RouteMap from './maps/RouteMap'

function MapView(): React.ReactElement {
  const { viewType, filteredLines, lines, shortestRoute, stations } =
    useRailwayMapContext()

  if (viewType === 'earth') {
    return (
      <div className="flex-1 overflow-hidden py-8">
        <div className="shadow-custom h-full w-full overflow-hidden rounded-lg">
          <EarthMap
            filteredLinesCode={filteredLines}
            lines={lines}
            stations={stations}
          />
        </div>
      </div>
    )
  }

  if (viewType === 'route') {
    return (
      <RouteMap
        filteredLinesCode={filteredLines}
        lines={lines}
        shortestRoute={shortestRoute}
        stations={stations}
      />
    )
  }

  return <div />
}

export default MapView
