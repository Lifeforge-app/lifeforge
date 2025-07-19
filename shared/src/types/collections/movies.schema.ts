/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: movies
 * Generated at: 2025-07-19T21:52:02.421Z
 * Contains: movies__entries
 */

import { z } from "zod/v4";

const Entry = z.object({
  tmdb_id: z.number(),
  title: z.string(),
  original_title: z.string(),
  poster: z.string(),
  genres: z.any(),
  duration: z.number(),
  overview: z.string(),
  countries: z.any(),
  language: z.string(),
  release_date: z.string(),
  watch_date: z.string(),
  ticket_number: z.string(),
  theatre_seat: z.string(),
  theatre_showtime: z.string(),
  theatre_location: z.string(),
  theatre_location_coords: z.object({ lat: z.number(), lon: z.number() }),
  theatre_number: z.string(),
  is_watched: z.boolean(),
});

type IEntry = z.infer<typeof Entry>;

export {
  Entry,
};

export type {
  IEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

const TMDBSearchResult = z.object({
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

type ITMDBSearchResult = z.infer<typeof TMDBSearchResult>

export { TMDBSearchResult }

export type { ITMDBSearchResult }
