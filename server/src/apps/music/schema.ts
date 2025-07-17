/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: music
 * Generated at: 2025-07-09T12:50:41.281Z
 * Contains: music__entries
 */
import { z } from "zod/v4";

const MusicEntrySchema = z.object({
  name: z.string(),
  duration: z.string(),
  author: z.string(),
  file: z.string(),
  is_favourite: z.boolean(),
});

type IMusicEntry = z.infer<typeof MusicEntrySchema>;

export { MusicEntrySchema };

export type { IMusicEntry };

// -------------------- CUSTOM SCHEMAS --------------------

const YoutubeDataSchema = z.object({
  title: z.string(),
  uploadDate: z.string(),
  uploader: z.string(),
  uploaderUrl: z.string().optional(),
  duration: z.string(),
  viewCount: z.number(),
  likeCount: z.number(),
  thumbnail: z.string(),
});

type IYoutubeData = z.infer<typeof YoutubeDataSchema>;

export { YoutubeDataSchema };

export type { IYoutubeData };
