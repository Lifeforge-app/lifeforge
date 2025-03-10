import clsx from 'clsx'
import React from 'react'
import LoadingScreen from '@components/screens/LoadingScreen'
import useThemeColors from '@hooks/useThemeColor'
import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import { useRailwayMapRenderer } from './hooks/useRailwayMapRenderer'

function RouteMap(): React.ReactElement {
  const { componentBg } = useThemeColors()
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
