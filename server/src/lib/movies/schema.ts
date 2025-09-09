import { z } from "zod/v4";

const moviesSchemas = {
  entries: z.object({
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
  }),
};

export default moviesSchemas;
