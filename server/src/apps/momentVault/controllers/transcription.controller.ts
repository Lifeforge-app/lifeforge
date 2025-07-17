import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import z from "zod/v4";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as TranscriptionService from "../services/transcription.service";
import { convertToMp3 } from "../utils/convertToMP3";

const momentVaultTranscriptionRouter = express.Router();

const transcribeExisted = forgeController
  .route("POST /:id")
  .description("Transcribe an existing audio entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.string(),
  })
  .existenceCheck("params", {
    id: "moment_vault__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await TranscriptionService.transcribeExisted(pb, id),
  );

const transcribeNew = forgeController
  .route("POST /")
  .description("Transcribe a new audio file")
  .schema({
    response: z.string(),
  })
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    const { file } = req;
    if (!file) {
      throw new ClientError("No file uploaded");
    }

    if (file.mimetype !== "audio/mp3") {
      file.path = await convertToMp3(file.path);
    }

    return await TranscriptionService.transcribeNew(pb, file.path);
  });

bulkRegisterControllers(momentVaultTranscriptionRouter, [
  transcribeExisted,
  transcribeNew,
]);

export default momentVaultTranscriptionRouter;
