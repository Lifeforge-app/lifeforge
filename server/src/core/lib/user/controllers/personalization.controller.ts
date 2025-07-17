import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as PersonalizationService from "../services/personalization.service";

const userPersonalizationRouter = express.Router();

const listGoogleFonts = forgeController
  .route("GET /fonts")
  .description("List available Google Fonts")
  .schema({
    response: z.object({
      enabled: z.boolean(),
      items: z.array(z.any()).optional(),
    }),
  })
  .callback(async ({ pb }) => PersonalizationService.listGoogleFonts(pb));

const getGoogleFont = forgeController
  .route("GET /font")
  .description("Get specific Google Font details")
  .schema({
    query: z.object({
      family: z.string(),
    }),
    response: z.object({
      enabled: z.boolean(),
      items: z.array(z.any()).optional(),
    }),
  })
  .callback(async ({ pb, query: { family } }) =>
    PersonalizationService.getGoogleFont(pb, family),
  );

const updateBgImage = forgeController
  .route("PUT /bg-image")
  .description("Update background image")
  .middlewares(singleUploadMiddleware)
  .schema({
    body: z.object({
      url: z.string().optional(),
    }),
    response: z.string(),
  })
  .callback(async ({ pb, body: { url }, req }) =>
    PersonalizationService.updateBgImage(pb, req.file, url),
  );

const deleteBgImage = forgeController
  .route("DELETE /bg-image")
  .description("Delete background image")
  .schema({
    response: z.void(),
  })
  .statusCode(204)
  .callback(
    async ({ pb }) =>
      await PersonalizationService.deleteBgImage(pb, pb.authStore.record!.id),
  );

const updatePersonalization = forgeController
  .route("PATCH /")
  .description("Update personalization settings")
  .schema({
    body: z.object({
      data: z.object({
        fontFamily: z.string().optional(),
        theme: z.string().optional(),
        color: z.string().optional(),
        bgTemp: z.string().optional(),
        language: z.string().optional(),
        dashboardLayout: z.record(z.string(), z.any()).optional(),
        backdropFilters: z.record(z.string(), z.any()).optional(),
      }),
    }),
    response: z.void(),
  })
  .statusCode(204)
  .callback(
    async ({ pb, body: { data } }) =>
      await PersonalizationService.updatePersonalization(
        pb,
        pb.authStore.record!.id,
        data,
      ),
  );

bulkRegisterControllers(userPersonalizationRouter, [
  listGoogleFonts,
  getGoogleFont,
  updateBgImage,
  deleteBgImage,
  updatePersonalization,
]);

export default userPersonalizationRouter;
