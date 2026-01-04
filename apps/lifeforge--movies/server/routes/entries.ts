import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import z from 'zod'

const list = forgeController
  .query()
  .description({
    en: 'Get all movie entries',
    ms: 'Dapatkan semua catatan filem',
    'zh-CN': '获取所有电影条目',
    'zh-TW': '獲取所有電影條目'
  })
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
            new Date(a.theatre_showtime).getTime() -
            new Date(b.theatre_showtime).getTime() // Earlier showtimes come first
          )
        }

        return a.title.localeCompare(b.title)
      })
    }
  })

const create = forgeController
  .mutation()
  .description({
    en: 'Create a movie entry from TMDB',
    ms: 'Cipta catatan filem daripada TMDB',
    'zh-CN': '从 TMDB 创建电影条目',
    'zh-TW': '從 TMDB 創建電影條目'
  })
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
  .description({
    en: 'Update movie entry with the latest data from TMDB',
    ms: 'Kemas kini catatan filem dengan data terkini daripada TMDB',
    'zh-CN': '使用 TMDB 的最新数据更新电影条目',
    'zh-TW': '使用 TMDB 的最新資料更新電影條目'
  })
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
  .description({
    en: 'Delete a movie entry',
    ms: 'Padam catatan filem',
    'zh-CN': '删除电影条目',
    'zh-TW': '刪除電影條目'
  })
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
  .description({
    en: 'Toggle watch status of a movie entry',
    ms: 'Togol status tontonan catatan filem',
    'zh-CN': '切换电影条目的观看状态',
    'zh-TW': '切換電影條目的觀看狀態'
  })
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
