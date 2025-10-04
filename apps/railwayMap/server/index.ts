import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import z from 'zod'

import dijkstraWithTransfers from './utils/pathFinding'

const getLines = forgeController
  .query()
  .description('Get all railway lines')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('railway_map__lines').execute()
  )

const getStations = forgeController
  .query()
  .description('Get all railway stations')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('railway_map__stations').execute()
  )

const getShortestPath = forgeController
  .query()
  .description('Get shortest path between two stations')
  .input({
    query: z.object({
      start: z.string(),
      end: z.string()
    })
  })
  .callback(async ({ pb, query: { start, end } }) => {
    const allStations = await pb.getFullList
      .collection('railway_map__stations')
      .execute()

    if (
      ![start, end].every(station => allStations.some(s => s.id === station))
    ) {
      throw new ClientError('Invalid start or end station')
    }

    const graphWithWeight = allStations.reduce<
      Record<string, Record<string, number>>
    >((acc, station) => {
      if (!station.distances) return acc
      acc[station.name] = Object.fromEntries(
        Object.entries(station.distances).map(([name, distance]) => [
          name,
          distance
        ])
      ) as Record<string, number>

      return acc
    }, {})

    const lines = allStations.reduce<Record<string, string[]>>(
      (acc, station) => {
        acc[station.name] = station.lines ?? []

        return acc
      },
      {}
    )

    const path = dijkstraWithTransfers(
      graphWithWeight,
      lines,
      allStations.find(s => s.id === start)?.name ?? '',
      allStations.find(s => s.id === end)?.name ?? ''
    )

    if (!path) {
      throw new Error('No path found')
    }

    return path
      .map(station => allStations.find(s => s.name === station))
      .filter(s => !!s)
  })

export default forgeRouter({
  getLines,
  getStations,
  getShortestPath
})
