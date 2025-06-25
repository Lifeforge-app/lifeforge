import type { RecordModel } from 'pocketbase'

import type { IFormState } from '@lifeforge/ui'

interface IMovieSearchResult {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

interface IMovieSearchResults {
  page: number
  results: IMovieSearchResult[]
  total_pages: number
  total_results: number
}

interface IMovieEntry extends RecordModel {
  tmdb_id: number
  title: string
  original_title: string
  poster: string
  genres: string[]
  duration: number
  overview: string
  countries: string[]
  language: string
  release_date: string
  watch_date: string
  ticket_number: string
  theatre_seat: string
  theatre_location: string
  theatre_showtime: string
  theatre_number: string
  calendar_record: string
  is_watched: boolean
}

interface IMovieTicketFormState extends IFormState {
  entry_id: string
  ticket_number: string
  theatre_seat: string
  theatre_location: string
  theatre_showtime?: Date
  theatre_number: string
}

export type {
  IMovieSearchResult,
  IMovieSearchResults,
  IMovieEntry,
  IMovieTicketFormState
}
