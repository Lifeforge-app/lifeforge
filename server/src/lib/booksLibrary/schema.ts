import { z } from "zod";

const booksLibrarySchemas = {
  collections: z.object({
    name: z.string(),
    icon: z.string(),
  }),
  languages: z.object({
    name: z.string(),
    icon: z.string(),
  }),
  entries: z.object({
    title: z.string(),
    authors: z.string(),
    md5: z.string(),
    year_published: z.number(),
    publisher: z.string(),
    languages: z.array(z.string()),
    collection: z.string(),
    extension: z.string(),
    edition: z.string(),
    size: z.number(),
    isbn: z.string(),
    file: z.string(),
    thumbnail: z.string(),
    is_favourite: z.boolean(),
    time_started: z.string(),
    time_finished: z.string(),
    read_status: z.enum(["read", "unread", "reading"]),
    created: z.string(),
    updated: z.string(),
  }),
  file_types: z.object({
    name: z.string(),
  }),
  file_types_aggregated: z.object({
    name: z.string(),
    amount: z.number(),
  }),
  languages_aggregated: z.object({
    name: z.string(),
    icon: z.string(),
    amount: z.number(),
  }),
  collections_aggregated: z.object({
    name: z.string(),
    icon: z.string(),
    amount: z.number(),
  }),
  read_status_aggregated: z.object({
    name: z.any(),
    icon: z.any(),
    color: z.any(),
    amount: z.number(),
  }),
};

export default booksLibrarySchemas;
