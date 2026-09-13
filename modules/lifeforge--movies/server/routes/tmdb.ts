import z from 'zod'

import forge from '../forge'

const TMDBSearchResultSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  genre_ids: z.array(z.number()),
  existed: z.boolean(),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number()
})

const TMDBResponseSchema = z.object({
  page: z.number(),
  results: z.array(TMDBSearchResultSchema),
  total_pages: z.number(),
  total_results: z.number()
})

export const search = forge
  .query({
    description: 'Search movies using TMDB API',
    input: {
      query: z.object({
        q: z.string().min(1, 'Query must not be empty'),
        page: z.string().optional().default('1')
      })
    },
    output: {
      OK: TMDBResponseSchema,
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      query: { q, page },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const parsedPage = parseInt(page) || 1

      const apiKey = await getAPIKey('tmdb', pb)

      if (!apiKey) {
        return response.badRequest('API key not found')
      }

      const url = `https://api.themoviedb.org/3/search/movie?query=${decodeURIComponent(
        q
      )}&page=${parsedPage}`

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })

      const tmdbData = await res.json()

      const allIds = await pb.getFullList
        .collection('entries')
        .filter([
          {
            combination: '||',
            filters: tmdbData.results.map((entry: { id: number }) => ({
              field: 'tmdb_id',
              operator: '=',
              value: entry.id
            }))
          }
        ])
        .execute()

      tmdbData.results.forEach((entry: any) => {
        entry.existed = allIds.some(e => e.tmdb_id === entry.id)
      })

      return response.ok(
        tmdbData as unknown as z.infer<typeof TMDBResponseSchema>
      )
    }
  )
