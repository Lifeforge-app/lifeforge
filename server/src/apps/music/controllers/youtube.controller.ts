import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { MusicSchemas } from "shared";
import { z } from "zod/v4";

import * as YoutubeService from "../services/youtube.service";

const musicYoutubeRouter = express.Router();

const getVideoInfo = forgeController
  .route("GET /get-info/:id")
  .description("Get YouTube video information")
  .schema({
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    response: MusicSchemas.YoutubeDataSchema,
  })
  .callback(
    async ({ params: { id } }) => await YoutubeService.getVideoInfo(id),
  );

const downloadVideo = forgeController
  .route("POST /async-download/:id")
  .description("Download YouTube video asynchronously")
  .schema({
    params: z.object({
      id: z.string().regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID"),
    }),
    body: z.object({
      title: z.string(),
      uploader: z.string(),
      duration: z.number(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, params: { id }, body }) => {
    if (YoutubeService.getDownloadStatus().status === "in_progress") {
      throw new Error("A download is already in progress");
    }

    YoutubeService.setDownloadStatus("in_progress");
    YoutubeService.downloadVideo(pb, id, body);

    return true;
  })
  .statusCode(202);

const getDownloadStatus = forgeController
  .route("GET /download-status")
  .description("Get current download status")
  .schema({
    response: z.object({
      status: z.enum(["empty", "in_progress", "completed", "failed"]),
    }),
  })
  .callback(async () => YoutubeService.getDownloadStatus());

bulkRegisterControllers(musicYoutubeRouter, [
  getVideoInfo,
  downloadVideo,
  getDownloadStatus,
]);

export default musicYoutubeRouter;
