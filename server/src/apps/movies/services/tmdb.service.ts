import { getAPIKey } from '@functions/getAPIKey'
import { WithPB } from '@typescript/pocketbase_interfaces'
import Pocketbase from 'pocketbase'

import { MoviesCollectionsSchemas } from 'shared/types/collections'

export const searchMovies = async (pb: Pocketbase, q: string, page: number) => {
  const apiKey = await getAPIKey('tmdb', pb)

  if (!apiKey) {
    throw new Error('API key not found')
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${decodeURIComponent(
    q
  )}&page=${page}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  }).then(res => res.json())

  const allIds = await pb
    .collection('movies__entries')
    .getFullList<WithPB<MoviesCollectionsSchemas.IEntry>>({
      filter: response.results
        .map((entry: { id: number }) => `tmdb_id = ${entry.id}`)
        .join(' || '),
      fields: 'tmdb_id'
    })

  response.results.forEach((entry: any) => {
    entry.existed = allIds.some(e => e.tmdb_id === entry.id)
  })

  return response
}
