import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const YoutubeSummarizer = {
  /**
   * @route       GET /info/:id
   * @description Get YouTube video information by video ID
   */
  getYoutubeVideoInfo: {
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    response: YoutubeInfoSchema,
  },

  /**
   * @route       POST /summarize
   * @description Summarize a YouTube video from URL
   */
  summarizeVideo: {
    body: z.object({
      url: z.string().url("Invalid URL"),
    }),
    response: z.string(),
  },
};

type IYoutubeSummarizer = z.infer<typeof YoutubeSummarizer>;

export type { IYoutubeSummarizer };
export { YoutubeSummarizer };
