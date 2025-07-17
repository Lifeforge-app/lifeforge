import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { default as _validateOTP } from "@functions/validateOTP";
import express from "express";
import { z } from "zod/v4";

import * as authService from "../services/auth.service";

const apiKeysAuthRouter = express.Router();

const getChallenge = forgeController
  .route("GET /challenge")
  .description("Get authentication challenge")
  .schema({
    response: z.string(),
  })
  .callback(async () => authService.challenge);

const createOrUpdateMasterPassword = forgeController
  .route("POST /")
  .description("Create or update master password")
  .schema({
    body: z.object({
      password: z.string(),
    }),
    response: z.void(),
  })
  .callback(async ({ pb, body: { password } }) =>
    authService.createOrUpdateMasterPassword(pb, password),
  );

const verifyMasterPassword = forgeController
  .route("POST /verify")
  .description("Verify master password")
  .schema({
    body: z.object({
      password: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, body: { password } }) =>
    authService.verifyMasterPassword(pb, password, authService.challenge),
  );

const verifyOTP = forgeController
  .route("POST /otp")
  .description("Verify OTP")
  .schema({
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(
    async ({ pb, body }) => await _validateOTP(pb, body, authService.challenge),
  );

bulkRegisterControllers(apiKeysAuthRouter, [
  getChallenge,
  createOrUpdateMasterPassword,
  verifyMasterPassword,
  verifyOTP,
]);

export default apiKeysAuthRouter;
