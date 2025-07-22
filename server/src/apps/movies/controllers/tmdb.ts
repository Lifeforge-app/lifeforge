import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as TMDBService from '../services/tmdb.service'

const searchMovies = forgeController
  .route('GET /search')
  .description('Search movies using TMDB API')
  .input({})
  .callback(({ pb, query: { q, page } }) =>
    TMDBService.searchMovies(pb, q, page)
  )

export default forgeRouter({ searchMovies })
