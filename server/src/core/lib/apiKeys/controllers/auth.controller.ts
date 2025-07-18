import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { default as _validateOTP } from "@functions/validateOTP";
import express from "express";
import { ApiKeysControllersSchemas } from "shared/types/controllers";

import * as authService from "../services/auth.service";

const apiKeysAuthRouter = express.Router();

const getChallenge = forgeController
  .route("GET /challenge")
  .description("Get authentication challenge")
  .schema(ApiKeysControllersSchemas.Auth.getChallenge)
  .callback(async () => authService.challenge);

const createOrUpdateMasterPassword = forgeController
  .route("POST /")
  .description("Create or update master password")
  .schema(ApiKeysControllersSchemas.Auth.createOrUpdateMasterPassword)
  .callback(async ({ pb, body: { password } }) =>
    authService.createOrUpdateMasterPassword(pb, password),
  );

const verifyMasterPassword = forgeController
  .route("POST /verify")
  .description("Verify master password")
  .schema(ApiKeysControllersSchemas.Auth.verifyMasterPassword)
  .callback(async ({ pb, body: { password } }) =>
    authService.verifyMasterPassword(pb, password, authService.challenge),
  );

const verifyOTP = forgeController
  .route("POST /otp")
  .description("Verify OTP")
  .schema(ApiKeysControllersSchemas.Auth.verifyOtp)
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
