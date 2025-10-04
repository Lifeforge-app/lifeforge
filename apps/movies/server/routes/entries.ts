import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import z from 'zod'

const list = forgeController
  .query()
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
      entries: entries.sort((a, b) => {
        if (a.is_watched !== b.is_watched) {
          return a.is_watched ? 1 : -1 // Unwatched entries come first
        }

        if (
          (a.ticket_number && !b.ticket_number) ||
          (!a.ticket_number && b.ticket_number)
        ) {
          return a.ticket_number ? -1 : 1 // Entries with tickets come first
        }

        if (a.theatre_showtime && b.theatre_showtime) {
          return (
            new Date(b.theatre_showtime).getTime() -
            new Date(a.theatre_showtime).getTime()
          )
        }

        return a.title.localeCompare(b.title)
      })
    }
  })

const create = forgeController
  .mutation()
  .description('Create a movie entry from TMDB')
  .input({
    query: z.object({
      id: z.string().transform(val => parseInt(val, 10))
    })
  })
  .statusCode(201)
  .callback(async ({ pb, query: { id } }) => {
    const apiKey = await getAPIKey('tmdb', pb)

    if (!apiKey) {
      throw new Error('API key not found')
    }

    const initialData = await pb.getFirstListItem
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

    if (initialData) {
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

const update = forgeController
  .mutation()
  .description('Update entries with the latest movie data from TMDB')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'movies__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const apiKey = await getAPIKey('tmdb', pb)

    if (!apiKey) {
      throw new Error('API key not found')
    }

    const movieEntry = await pb.getOne
      .collection('movies__entries')
      .id(id)
      .execute()

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieEntry.tmdb_id}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    )
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

    return await pb.update
      .collection('movies__entries')
      .id(id)
      .data(entryData)
      .execute()
  })

const remove = forgeController
  .mutation()
  .description('Delete a movie entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'movies__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('movies__entries').id(id).execute()
  )

const toggleWatchStatus = forgeController
  .mutation()
  .description('Toggle watch status of a movie entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'movies__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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
  list,
  create,
  update,
  remove,
  toggleWatchStatus
})
