import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { default as _validateOTP } from "@functions/validateOTP";
import express from "express";
import { z } from "zod/v4";

import * as AuthService from "../services/auth.service";

const userAuthRouter = express.Router();

const validateOTP = forgeController
  .route("POST /validate-otp")
  .description("Validate OTP")
  .schema({
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, body }) => await _validateOTP(pb, body));

const generateOTP = forgeController
  .route("GET /otp")
  .description("Generate OTP")
  .schema({
    response: z.string(),
  })
  .callback(async ({ pb }) => await AuthService.generateOTP(pb));

const login = forgeController
  .route("POST /login")
  .description("User login")
  .schema({
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    response: z.union([
      z.object({
        state: z.literal("2fa_required"),
        tid: z.string(),
      }),
      z.object({
        state: z.literal("success"),
        session: z.string(),
        userData: z.record(z.string(), z.any()),
      }),
    ]),
  })
  .callback(
    async ({ body: { email, password } }) =>
      await AuthService.login(email, password),
  );

const verifySessionToken = forgeController
  .route("POST /verify")
  .description("Verify session token")
  .schema({
    response: z.object({
      session: z.string(),
      userData: z.record(z.string(), z.any()),
    }),
  })
  .callback(async ({ req }) =>
    AuthService.verifySessionToken(
      req.headers.authorization?.split(" ")[1].trim(),
    ),
  );

bulkRegisterControllers(userAuthRouter, [
  validateOTP,
  generateOTP,
  login,
  verifySessionToken,
]);

export default userAuthRouter;
