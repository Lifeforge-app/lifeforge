import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { getAPIKey } from "@functions/getAPIKey";
import express from "express";
import { z } from "zod/v4";

const router = express.Router();

const getLocation = forgeController
  .route("GET /")
  .description("Search for locations")
  .schema({
    query: z.object({
      q: z.string(),
    }),
    response: z.any(),
  })
  .callback(async ({ query: { q }, pb }) => {
    const key = await getAPIKey("gcloud", pb);

    if (!key) {
      throw new ClientError("API key not found");
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.displayName,places.location,places.formattedAddress",
          "X-Goog-Api-Key": key,
        },
        body: JSON.stringify({
          textQuery: q,
        }),
      },
    ).then((res) => res.json());

    return response.places;
  });

const checkIsEnabled = forgeController
  .route("GET /enabled")
  .description("Check if Google Cloud API key exists")
  .schema({
    response: z.boolean(),
  })
  .callback(async ({ pb }) => {
    const key = await getAPIKey("gcloud", pb);
    return !!key;
  });

bulkRegisterControllers(router, [getLocation, checkIsEnabled]);

export default router;
