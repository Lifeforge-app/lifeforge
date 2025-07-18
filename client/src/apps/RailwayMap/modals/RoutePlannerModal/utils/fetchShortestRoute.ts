import { fetchAPI } from 'shared/lib'

import { IRailwayMapStation } from '@apps/RailwayMap/interfaces/railway_map_interfaces'

export default async function fetchShortestRoute(
  start: string,
  end: string
): Promise<IRailwayMapStation[]> {
  if (!start || !end) {
    throw new Error('Start and end stations are required')
  }

  const data = await fetchAPI<IRailwayMapStation[]>(
    import.meta.env.VITE_API_HOST,
    `railway-map/shortest?start=${start}&end=${end}`
  )

  return data
}
