import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { getAPIKey } from "@functions/getAPIKey";
import express from "express";
import { AiControllersSchemas } from "shared/types/controllers";

import * as ImageGenerationService from "../services/imageGeneration.service";

const imageGenerationRouter = express.Router();

const checkKey = forgeController
  .route("GET /key-exists")
  .description("Check if OpenAI API key exists")
  .schema(AiControllersSchemas.ImageGeneration.checkKey)
  .callback(async ({ pb }) => !!(await getAPIKey("openai", pb)));

const generateImage = forgeController
  .route("POST /generate-image")
  .description("Generate an image from a text prompt")
  .schema(AiControllersSchemas.ImageGeneration.generateImage)
  .callback(async ({ pb, body: { prompt } }) =>
    ImageGenerationService.generateImage(pb, prompt),
  );

bulkRegisterControllers(imageGenerationRouter, [checkKey, generateImage]);

export default imageGenerationRouter;
