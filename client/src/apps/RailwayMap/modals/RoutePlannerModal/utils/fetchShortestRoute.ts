import { IRailwayMapStation } from '@apps/RailwayMap/interfaces/railway_map_interfaces'

import fetchAPI from '@utils/fetchAPI'

export default async function fetchShortestRoute(
  start: string,
  end: string
): Promise<IRailwayMapStation[]> {
  if (!start || !end) {
    throw new Error('Start and end stations are required')
  }

  const data = await fetchAPI<IRailwayMapStation[]>(
    `railway-map/shortest?start=${start}&end=${end}`
  )

  return data
}
