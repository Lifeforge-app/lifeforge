import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { YoutubeInfoSchema } from "../schema";
import * as YoutubeSummarizerService from "../services/youtubeSummarizer.service";

const youtubeSummarizerRouter = express.Router();

const getYoutubeVideoInfo = forgeController
  .route("GET /info/:id")
  .description("Get YouTube video information by video ID")
  .schema({
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    response: YoutubeInfoSchema,
  })
  .callback(
    async ({ params: { id } }) =>
      await YoutubeSummarizerService.getYoutubeVideoInfo(id),
  );

const summarizeVideo = forgeController
  .route("POST /summarize")
  .description("Summarize a YouTube video from URL")
  .schema({
    body: z.object({
      url: z.string().url("Invalid URL"),
    }),
    response: z.string(),
  })
  .callback(({ body: { url }, pb }) =>
    YoutubeSummarizerService.summarizeVideo(url, pb),
  );

bulkRegisterControllers(youtubeSummarizerRouter, [
  getYoutubeVideoInfo,
  summarizeVideo,
]);

export default youtubeSummarizerRouter;
