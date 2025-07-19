import { z } from 'zod/v4'

import {
  LocationsCustomSchemas,
  MoviesCollectionsSchemas
} from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Tmdb = {
  /**
   * @route       GET /search
   * @description Search movies using TMDB API
   */
  searchMovies: {
    query: z.object({
      q: z.string().min(1, 'Query must not be empty'),
      page: z
        .string()
        .optional()
        .default('1')
        .transform(val => parseInt(val) || 1)
    }),
    response: z.object({
      page: z.number(),
      results: z.array(MoviesCollectionsSchemas.TMDBSearchResult),
      total_pages: z.number(),
      total_results: z.number()
    })
  }
}

const Ticket = {
  /**
   * @route       POST /
   * @description Update ticket information for a movie entry
   */
  updateTicket: {
    params: z.object({
      id: z.string()
    }),
    body: MoviesCollectionsSchemas.Entry.pick({
      ticket_number: true,
      theatre_number: true,
      theatre_seat: true,
      theatre_showtime: true
    }).extend({
      theatre_location: LocationsCustomSchemas.Location
    }),
    response: SchemaWithPB(MoviesCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /:id
   * @description Clear ticket information for a movie entry
   */
  clearTicket: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

const Entries = {
  /**
   * @route       GET /
   * @description Get all movie entries
   */
  getAllEntries: {
    query: z.object({
      watched: z
        .enum(['true', 'false'])
        .optional()
        .default('false')
        .transform(val => (val === 'true' ? true : false))
    }),
    response: z.object({
      entries: z.array(SchemaWithPB(MoviesCollectionsSchemas.Entry)),
      total: z.number()
    })
  },

  /**
   * @route       POST /:id
   * @description Create a movie entry from TMDB
   */
  createEntryFromTmdb: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(MoviesCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /:id
   * @description Delete a movie entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       PATCH /watch-status/:id
   * @description Toggle watch status of a movie entry
   */
  toggleWatchStatus: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(MoviesCollectionsSchemas.Entry)
  }
}

type ITmdb = InferApiESchemaDynamic<typeof Tmdb>
type ITicket = InferApiESchemaDynamic<typeof Ticket>
type IEntries = InferApiESchemaDynamic<typeof Entries>

export type { ITmdb, ITicket, IEntries }

export { Tmdb, Ticket, Entries }
