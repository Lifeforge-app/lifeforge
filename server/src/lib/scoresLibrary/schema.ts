import { z } from "zod/v4";

const scoresLibrarySchemas = {
  entries: z.object({
    name: z.string(),
    type: z.string(),
    pageCount: z.string(),
    thumbnail: z.string(),
    author: z.string(),
    pdf: z.string(),
    audio: z.string(),
    musescore: z.string(),
    isFavourite: z.boolean(),
    collection: z.string(),
    guitar_world_id: z.number(),
    created: z.string(),
    updated: z.string(),
  }),
  authors_aggregated: z.object({
    name: z.string(),
    amount: z.number(),
  }),
  types: z.object({
    name: z.string(),
    icon: z.string(),
  }),
  types_aggregated: z.object({
    name: z.string(),
    icon: z.string(),
    amount: z.number(),
  }),
  collections: z.object({
    name: z.string(),
  }),
  collections_aggregated: z.object({
    name: z.string(),
    amount: z.number(),
  }),
};

export default scoresLibrarySchemas;
