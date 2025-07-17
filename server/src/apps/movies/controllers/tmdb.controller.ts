import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import * as TMDBService from "../services/tmdb.service";

const moviesTMDBRouter = express.Router();

const searchMovies = forgeController
  .route("GET /search")
  .description("Search movies using TMDB API")
  .schema({
    query: z.object({
      q: z.string().min(1, "Query must not be empty"),
      page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => parseInt(val) || 1),
    }),
    response: z.any(),
  })
  .callback(({ pb, query: { q, page } }) =>
    TMDBService.searchMovies(pb, q, page),
  );

bulkRegisterControllers(moviesTMDBRouter, [searchMovies]);

export default moviesTMDBRouter;
