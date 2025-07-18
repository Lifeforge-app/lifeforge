import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { MoviesControllersSchemas } from "shared/types/controllers";

import * as TMDBService from "../services/tmdb.service";

const moviesTMDBRouter = express.Router();

const searchMovies = forgeController
  .route("GET /search")
  .description("Search movies using TMDB API")
  .schema(MoviesControllersSchemas.Tmdb.searchMovies)
  .callback(({ pb, query: { q, page } }) =>
    TMDBService.searchMovies(pb, q, page),
  );

bulkRegisterControllers(moviesTMDBRouter, [searchMovies]);

export default moviesTMDBRouter;
