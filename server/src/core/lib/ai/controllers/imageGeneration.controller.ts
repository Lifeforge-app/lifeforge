import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { getAPIKey } from "@functions/getAPIKey";
import express from "express";
import { z } from "zod/v4";

import * as ImageGenerationService from "../services/imageGeneration.service";

const imageGenerationRouter = express.Router();

const checkKey = forgeController
  .route("GET /key-exists")
  .description("Check if OpenAI API key exists")
  .schema({
    response: z.boolean(),
  })
  .callback(async ({ pb }) => !!(await getAPIKey("openai", pb)));

const generateImage = forgeController
  .route("POST /generate-image")
  .description("Generate an image from a text prompt")
  .schema({
    body: z.object({
      prompt: z.string().min(1, "Prompt cannot be empty"),
    }),
    response: z.string(),
  })
  .callback(async ({ pb, body: { prompt } }) =>
    ImageGenerationService.generateImage(pb, prompt),
  );

bulkRegisterControllers(imageGenerationRouter, [checkKey, generateImage]);

export default imageGenerationRouter;
