import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { RailwayMapCollectionsSchemas } from "../collections";

const RailwayMap = {
  /**
   * @route       GET /lines
   * @description Get all railway lines
   */
  getLines: {
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Line)),
  },

  /**
   * @route       GET /stations
   * @description Get all railway stations
   */
  getStations: {
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Station)),
  },

  /**
   * @route       GET /shortest
   * @description Get shortest path between two stations
   */
  getShortestPath: {
    query: z.object({
      start: z.string(),
      end: z.string(),
    }),
    response: z.array(SchemaWithPB(RailwayMapCollectionsSchemas.Station)),
  },
};

type IRailwayMap = z.infer<typeof RailwayMap>;

export type { IRailwayMap };
export { RailwayMap };
