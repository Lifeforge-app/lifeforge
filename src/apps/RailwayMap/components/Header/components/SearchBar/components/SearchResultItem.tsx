import { IRailwayMapStation } from '@apps/RailwayMap/interfaces/railway_map_interfaces'
import { Icon } from '@iconify/react/dist/iconify.js'

import { useRailwayMapContext } from '../../../../../providers/RailwayMapProvider'
import { centerMapOnStation } from '../../../../Maps/maps/RouteMap/utils/renderUtils'
import StationCodes from '../../../../StationCode'

function SearchResultItem({ station }: { station: IRailwayMapStation }) {
  const {
    viewType,
    routeMapSVGRef,
    routeMapGRef,
    setSelectedStation,
    setSearchQuery,
    centerStation
  } = useRailwayMapContext()

  const onClick = () => {
    setSelectedStation(station)
    setSearchQuery('')
    if (viewType === 'route' && station.map_data && centerStation) {
      centerMapOnStation(routeMapSVGRef, routeMapGRef, station, centerStation)
    }
  }

  return (
    <button
      key={station.id}
      className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800/50 flex w-full p-4 px-6 transition-all"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Icon
          className="size-7"
          icon={
            station.type === 'interchange' ? 'tabler:exchange' : 'uil:subway'
          }
        />
        <div>
          <p className="text-left font-medium">{station.name}</p>
        </div>
      </div>
      <StationCodes codes={station.codes} />
    </button>
  )
}

export default SearchResultItem
