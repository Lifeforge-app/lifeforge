import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { getAPIKey } from "@functions/getAPIKey";
import express from "express";
import { z } from "zod/v4";

import { PixabaySearchResultSchema } from "../schema";

const pixabayRouter = express.Router();

const checkKeyExists = forgeController
  .route("GET /key-exists")
  .description("Check if Pixabay API key exists")
  .schema({
    response: z.boolean(),
  })
  .callback(async ({ pb }) => !!(await getAPIKey("pixabay", pb)));

const searchImages = forgeController
  .route("GET /search")
  .description("Search images on Pixabay")
  .schema({
    query: z.object({
      q: z.string().min(1),
      page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => parseInt(val, 10) || 1),
      type: z.enum(["all", "photo", "illustration", "vector"]).default("all"),
      category: z
        .enum([
          "backgrounds",
          "fashion",
          "nature",
          "science",
          "education",
          "feelings",
          "health",
          "people",
          "religion",
          "places",
          "animals",
          "industry",
          "computer",
          "food",
          "sports",
          "transportation",
          "travel",
          "buildings",
          "business",
          "music",
        ])
        .optional(),
      colors: z
        .enum([
          "grayscale",
          "transparent",
          "red",
          "orange",
          "yellow",
          "green",
          "turquoise",
          "blue",
          "lilac",
          "pink",
          "white",
          "gray",
          "black",
          "brown",
        ])
        .optional()
        .nullable(),
      editors_choice: z
        .enum(["true", "false"])
        .default("false")
        .transform((val) => val === "true"),
    }),
    response: PixabaySearchResultSchema,
  })
  .callback(
    async ({
      query: { q, page, type, category, colors, editors_choice },
      pb,
    }) => {
      const key = await getAPIKey("pixabay", pb);

      if (!key) {
        throw new ClientError("Pixabay API key is not set");
      }

      const url = new URL("https://pixabay.com/api/");

      url.searchParams.append("key", key);
      url.searchParams.append("q", q);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("image_type", type);
      if (category) {
        url.searchParams.append("category", category);
      }
      if (colors) {
        url.searchParams.append("colors", colors);
      }
      url.searchParams.append("editors_choice", editors_choice.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          `Pixabay API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      return {
        total: data.totalHits,
        hits: data.hits.map((hit: any) => ({
          id: hit.id,
          thumbnail: {
            url: hit.webformatURL,
            width: hit.webformatWidth,
            height: hit.webformatHeight,
          },
          imageURL: hit.largeImageURL,
        })),
      };
    },
  );

bulkRegisterControllers(pixabayRouter, [checkKeyExists, searchImages]);

export default pixabayRouter;
