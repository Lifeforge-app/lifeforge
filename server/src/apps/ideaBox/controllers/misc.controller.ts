import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import * as miscService from "../services/misc.service";

const ideaBoxMiscRouter = express.Router();

const getPath = forgeController
  .route("GET /path/:container/*")
  .description("Get path information for a container")
  .schema({
    params: z.object({
      container: z.string(),
      "0": z.string(),
    }),
    response: z.any(),
  })
  .callback(async ({ pb, params: { container, "0": pathParam }, req, res }) => {
    const result = await miscService.getPath(
      pb,
      container,
      pathParam.split("/").filter((p) => p !== ""),
      req,
      res,
    );

    if (!result) {
      throw new Error("Something went wrong while fetching the path");
    }

    return result;
  });

const checkValid = forgeController
  .route("GET /valid/:container/*")
  .description("Check if a path is valid")
  .schema({
    params: z.object({
      container: z.string(),
      "0": z.string(),
    }),
    response: z.boolean(),
  })
  .callback(
    async ({ pb, params: { container, "0": pathParam }, req, res }) =>
      await miscService.checkValid(
        pb,
        container,
        pathParam.split("/").filter((p) => p !== ""),
        req,
        res,
      ),
  );

const getOgData = forgeController
  .route("GET /og-data/:id")
  .description("Get Open Graph data for an entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.record(z.string(), z.any()),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id } }) => await miscService.getOgData(pb, id),
  );

const search = forgeController
  .route("GET /search")
  .description("Search entries")
  .schema({
    query: z.object({
      q: z.string(),
      container: z.string().optional(),
      tags: z.string().optional(),
      folder: z.string().optional(),
    }),
    response: z.any(),
  })
  .existenceCheck("query", {
    container: "[idea_box_containers]",
  })
  .callback(
    async ({ pb, query: { q, container, tags, folder }, req, res }) =>
      await miscService.search(
        pb,
        q,
        container || "",
        tags || "",
        folder || "",
        req,
        res,
      ),
  );

bulkRegisterControllers(ideaBoxMiscRouter, [
  getPath,
  checkValid,
  getOgData,
  search,
]);

export default ideaBoxMiscRouter;
