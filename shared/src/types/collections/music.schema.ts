/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: music
 * Generated at: 2025-07-19T14:07:18.232Z
 * Contains: music__entries
 */

import { z } from "zod/v4";

const Entry = z.object({
  name: z.string(),
  duration: z.string(),
  author: z.string(),
  file: z.string(),
  is_favourite: z.boolean(),
});

type IEntry = z.infer<typeof Entry>;

export {
  Entry,
};

export type {
  IEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

const YoutubeDataSchema = z.object({
  title: z.string(),
  uploadDate: z.string(),
  uploader: z.string(),
  uploaderUrl: z.string().optional(),
  duration: z.string(),
  viewCount: z.number(),
  likeCount: z.number(),
  thumbnail: z.string()
})

type IYoutubeData = z.infer<typeof YoutubeDataSchema>

export { YoutubeDataSchema }

export type { IYoutubeData }
