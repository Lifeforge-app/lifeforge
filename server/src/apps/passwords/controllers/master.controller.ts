import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { default as _validateOTP } from "@functions/validateOTP";
import express from "express";
import { v4 } from "uuid";
import { z } from "zod/v4";

import * as MasterService from "../services/master.service";

const passwordsMasterRouter = express.Router();

let challenge = v4();

setTimeout(() => {
  challenge = v4();
}, 1000 * 60);

const getChallenge = forgeController
  .route("GET /challenge")
  .description("Get current challenge for master password operations")
  .schema({
    response: z.string(),
  })
  .callback(async () => challenge);

const createMaster = forgeController
  .route("POST /")
  .description("Create a new master password")
  .schema({
    body: z.object({
      password: z.string(),
    }),
    response: z.void(),
  })
  .callback(async ({ pb, body: { password } }) =>
    MasterService.createMaster(pb, password),
  );

const verifyMaster = forgeController
  .route("POST /verify")
  .description("Verify master password")
  .schema({
    body: z.object({
      password: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, body: { password } }) =>
    MasterService.verifyMaster(pb, password, challenge),
  );

const validateOTP = forgeController
  .route("POST /otp")
  .description("Validate OTP for master password operations")
  .schema({
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, body }) => await _validateOTP(pb, body, challenge));

bulkRegisterControllers(passwordsMasterRouter, [
  getChallenge,
  createMaster,
  verifyMaster,
  validateOTP,
]);

export default passwordsMasterRouter;
