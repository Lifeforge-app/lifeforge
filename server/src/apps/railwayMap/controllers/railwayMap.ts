import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as RailwayMapServices from '../services/railwayMap.service'

const getLines = forgeController
  .route('GET /lines')
  .description('Get all railway lines')
  .input({})
  .callback(async ({ pb }) => await RailwayMapServices.getLines(pb))

const getStations = forgeController
  .route('GET /stations')
  .description('Get all railway stations')
  .input({})
  .callback(async ({ pb }) => RailwayMapServices.getStations(pb))

const getShortestPath = forgeController
  .route('GET /shortest')
  .description('Get shortest path between two stations')
  .input({})
  .callback(
    async ({ pb, query: { start, end } }) =>
      await RailwayMapServices.getShortestPath(pb, start, end)
  )

export default forgeRouter({
  getLines,
  getStations,
  getShortestPath
})
