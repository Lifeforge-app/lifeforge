import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as SettingsService from "../services/settings.service";

const userSettingsRouter = express.Router();

const updateAvatar = forgeController
  .route("PUT /avatar")
  .description("Update user avatar")
  .middlewares(singleUploadMiddleware)
  .schema({
    response: z.string(),
  })
  .callback(async ({ req: { file }, pb }) =>
    SettingsService.updateAvatar(pb, file),
  );

const deleteAvatar = forgeController
  .route("DELETE /avatar")
  .description("Delete user avatar")
  .schema({
    response: z.void(),
  })
  .statusCode(204)
  .callback(async ({ pb }) => SettingsService.deleteAvatar(pb));

const updateProfile = forgeController
  .route("PATCH /")
  .description("Update user profile")
  .schema({
    body: z.object({
      data: z.object({
        username: z
          .string()
          .regex(/^[a-zA-Z0-9]+$/)
          .optional(),
        email: z.email().optional(),
        name: z.string().optional(),
        dateOfBirth: z.string().optional(),
      }),
    }),
    response: z.void(),
  })
  .statusCode(200)
  .callback(async ({ body: { data }, pb }) =>
    SettingsService.updateProfile(pb, data),
  );

const requestPasswordReset = forgeController
  .route("POST /request-password-reset")
  .description("Request password reset")
  .schema({
    response: z.void(),
  })
  .callback(async ({ pb }) => SettingsService.requestPasswordReset(pb));

bulkRegisterControllers(userSettingsRouter, [
  updateAvatar,
  deleteAvatar,
  updateProfile,
  requestPasswordReset,
]);

export default userSettingsRouter;
