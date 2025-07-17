import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { RailwayMapLineSchema, RailwayMapStationSchema } from "../schema";
import * as RailwayMapServices from "../services/railwayMap.service";

const railwayMapRouter = express.Router();

const getLines = forgeController
  .route("GET /lines")
  .description("Get all railway lines")
  .schema({
    response: z.array(WithPBSchema(RailwayMapLineSchema)),
  })
  .callback(async ({ pb }) => await RailwayMapServices.getLines(pb));

const getStations = forgeController
  .route("GET /stations")
  .description("Get all railway stations")
  .schema({
    response: z.array(WithPBSchema(RailwayMapStationSchema)),
  })
  .callback(async ({ pb }) => RailwayMapServices.getStations(pb));

const getShortestPath = forgeController
  .route("GET /shortest")
  .description("Get shortest path between two stations")
  .schema({
    query: z.object({
      start: z.string(),
      end: z.string(),
    }),
    response: z.array(WithPBSchema(RailwayMapStationSchema)),
  })
  .callback(
    async ({ pb, query: { start, end } }) =>
      await RailwayMapServices.getShortestPath(pb, start, end),
  );

bulkRegisterControllers(railwayMapRouter, [
  getLines,
  getStations,
  getShortestPath,
]);

export default railwayMapRouter;
