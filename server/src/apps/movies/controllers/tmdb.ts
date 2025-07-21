import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { MoviesControllersSchemas } from 'shared/types/controllers'

import * as TMDBService from '../services/tmdb.service'

const searchMovies = forgeController
  .route('GET /search')
  .description('Search movies using TMDB API')
  .schema(MoviesControllersSchemas.Tmdb.searchMovies)
  .callback(({ pb, query: { q, page } }) =>
    TMDBService.searchMovies(pb, q, page)
  )

export default forgeRouter({ searchMovies })
