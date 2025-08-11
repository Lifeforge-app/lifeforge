import { LoadingScreen } from 'lifeforge-ui'

import { useRailwayMapContext } from '../../../../providers/RailwayMapProvider'
import { useRailwayMapRenderer } from './hooks/useRailwayMapRenderer'

function RouteMap() {
  const {
    routeMapSVGRef: svgRef,
    routeMapGRef: gRef,
    shortestRoute,
    setSelectedStation
  } = useRailwayMapContext()

  useRailwayMapRenderer()

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const target = event.target as SVGElement

    if (
      !target.closest('circle.station') &&
      !target.closest('rect.interchange')
    ) {
      setSelectedStation(null)
    }
  }

  return (
    <div className="w-full flex-1 pb-8">
      {typeof shortestRoute === 'string' ? (
        <LoadingScreen />
      ) : (
        <div className="shadow-custom component-bg h-full w-full rounded-lg">
          <svg ref={svgRef} height="100%" width="100%" onClick={handleMapClick}>
            <g ref={gRef}></g>
          </svg>
        </div>
      )}
    </div>
  )
}

export default RouteMap
