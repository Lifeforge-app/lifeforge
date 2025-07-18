import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { MusicCollectionsCollectionsSchemas } from "../collections";

const Youtube = {
  /**
   * @route       GET /get-info/:id
   * @description Get YouTube video information
   */
  getVideoInfo: {
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    response: MusicCollectionsSchemas.YoutubeDataSchema,
  },

  /**
   * @route       POST /async-download/:id
   * @description Download YouTube video asynchronously
   */
  downloadVideo: {
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    body: z.object({
      title: z.string(),
      uploader: z.string(),
      duration: z.number(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       GET /download-status
   * @description Get current download status
   */
  getDownloadStatus: {
    response: z.object({
      status: z.enum(["empty", "in_progress", "completed", "failed"]),
    }),
  },
};

const Entries = {
  /**
   * @route       GET /
   * @description Get all music entries
   */
  getAllEntries: {
    response: z.array(SchemaWithPB(MusicCollectionsSchemas.Entry)),
  },

  /**
   * @route       PATCH /:id
   * @description Update a music entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: MusicCollectionsSchemas.Entry.pick({
      name: true,
      author: true,
    }),
    response: SchemaWithPB(MusicCollectionsSchemas.Entry),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a music entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /favourite/:id
   * @description Toggle favorite status of a music entry
   */
  toggleFavorite: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(MusicCollectionsSchemas.Entry),
  },
};

type IYoutube = z.infer<typeof Youtube>;
type IEntries = z.infer<typeof Entries>;

export type { IYoutube, IEntries };
export { Youtube, Entries };
