import clsx from 'clsx'

import { LoadingScreen } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { useRailwayMapContext } from '../../../../providers/RailwayMapProvider'
import { useRailwayMapRenderer } from './hooks/useRailwayMapRenderer'

function RouteMap() {
  const { componentBg } = useComponentBg()
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
    <div className="mt-6 w-full flex-1 pb-8">
      {typeof shortestRoute === 'string' ? (
        <LoadingScreen />
      ) : (
        <div
          className={clsx(
            'shadow-custom h-full w-full rounded-lg',
            componentBg
          )}
        >
          <svg ref={svgRef} height="100%" width="100%" onClick={handleMapClick}>
            <g ref={gRef}></g>
          </svg>
        </div>
      )}
    </div>
  )
}

export default RouteMap
