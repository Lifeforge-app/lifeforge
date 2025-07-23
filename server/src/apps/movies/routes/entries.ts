import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all movie entries')
  .input({
    query: z.object({
      watched: z
        .enum(['true', 'false'])
        .optional()
        .default('false')
        .transform(val => (val === 'true' ? true : false))
    })
  })
  .callback(async ({ pb, query: { watched } }) => {
    const entries = await pb.getFullList
      .collection('movies__entries')
      .filter([
        {
          field: 'is_watched',
          operator: '=',
          value: watched
        }
      ])
      .sort(['-is_watched', '-ticket_number', '-theatre_showtime', 'title'])
      .execute()

    const total = (
      await pb.getList
        .collection('movies__entries')
        .page(1)
        .perPage(1)
        .execute()
    ).totalItems

    return {
      total,
      entries
    }
  })

const createEntryFromTMDB = forgeController
  .route('POST /:id')
  .description('Create a movie entry from TMDB')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .statusCode(201)
  .callback(async ({ pb, params: { id } }) => {
    const apiKey = await getAPIKey('tmdb', pb)

    if (!apiKey) {
      throw new Error('API key not found')
    }

    const existedData = await pb.getFirstListItem
      .collection('movies__entries')
      .filter([
        {
          field: 'tmdb_id',
          operator: '=',
          value: id
        }
      ])
      .execute()
      .catch(() => null)

    if (existedData) {
      throw new Error('Entry already exists')
    }

    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then(res => res.json())
      .catch(err => {
        throw new Error(`Failed to fetch data from TMDB: ${err.message}`)
      })

    const entryData = {
      tmdb_id: response.id,
      title: response.title,
      original_title: response.original_title,
      poster: response.poster_path,
      genres: response.genres.map((genre: { name: string }) => genre.name),
      duration: response.runtime,
      overview: response.overview,
      release_date: response.release_date,
      countries: response.origin_country,
      language: response.original_language
    }

    return await pb.create
      .collection('movies__entries')
      .data(entryData)
      .execute()
  })

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a movie entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('movies__entries').id(id).execute()
  )

const toggleWatchStatus = forgeController
  .route('PATCH /watch-status/:id')
  .description('Toggle watch status of a movie entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const entry = await pb.getOne.collection('movies__entries').id(id).execute()

    return await pb.update
      .collection('movies__entries')
      .id(id)
      .data({
        is_watched: !entry.is_watched,
        watch_date: !entry.is_watched
          ? entry.theatre_showtime || new Date().toISOString()
          : null
      })
      .execute()
  })

export default forgeRouter({
  getAllEntries,
  createEntryFromTMDB,
  deleteEntry,
  toggleWatchStatus
})
