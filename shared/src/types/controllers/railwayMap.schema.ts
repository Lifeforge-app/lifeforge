import { z } from 'zod/v4'

import { RailwayMapCollectionsSchemas } from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const RailwayMap = {
  /**
   * @route       GET /lines
   * @description Get all railway lines
   */
  getLines: {
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Line))
  },

  /**
   * @route       GET /stations
   * @description Get all railway stations
   */
  getStations: {
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Station))
  },

  /**
   * @route       GET /shortest
   * @description Get shortest path between two stations
   */
  getShortestPath: {
    query: z.object({
      start: z.string(),
      end: z.string()
    }),
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Station))
  }
}

type IRailwayMap = InferApiESchemaDynamic<typeof RailwayMap>

export type { IRailwayMap }

export { RailwayMap }
