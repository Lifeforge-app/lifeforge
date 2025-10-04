import { useRailwayMapContext } from '../../providers/RailwayMapProvider'
import EarthMap from './maps/EarthMap'
import RouteMap from './maps/RouteMap'

function MapView() {
  const { viewType } = useRailwayMapContext()

  if (viewType === 'earth') {
    return <EarthMap />
  }

  if (viewType === 'route') {
    return <RouteMap />
  }

  return <></>
}

export default MapView
