import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { default as _validateOTP } from "@functions/validateOTP";
import express from "express";
import { z } from "zod/v4";

import * as twoFAService from "../services/twoFA.service";

const userTwoFARouter = express.Router();

export let canDisable2FA = false;

const getChallenge = forgeController
  .route("GET /challenge")
  .description("Get 2FA challenge")
  .schema({
    response: z.string(),
  })
  .callback(async () => twoFAService.getChallenge());

const requestOTP = forgeController
  .route("GET /otp")
  .description("Request OTP for 2FA")
  .schema({
    query: z.object({
      email: z.email(),
    }),
    response: z.string(),
  })
  .callback(
    async ({ pb, query: { email } }) =>
      await twoFAService.requestOTP(pb, email),
  );

const validateOTP = forgeController
  .route("POST /otp")
  .description("Validate OTP for 2FA")
  .schema({
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ pb, body }) => {
    if (await _validateOTP(pb, body, twoFAService.challenge)) {
      canDisable2FA = true;

      setTimeout(
        () => {
          canDisable2FA = false;
        },
        1000 * 60 * 5,
      );

      return true;
    }

    return false;
  });

const generateAuthtenticatorLink = forgeController
  .route("GET /link")
  .description("Generate authenticator link for 2FA")
  .schema({
    response: z.string(),
  })
  .callback(
    async ({
      pb,
      req: {
        headers: { authorization },
      },
    }) =>
      await twoFAService.generateAuthenticatorLink(
        pb,
        authorization!.replace("Bearer ", ""),
      ),
  );

const verifyAndEnable2FA = forgeController
  .route("POST /verify-and-enable")
  .description("Verify and enable 2FA")
  .schema({
    body: z.object({
      otp: z.string(),
    }),
    response: z.void(),
  })
  .callback(
    async ({
      pb,
      body: { otp },
      req: {
        headers: { authorization },
      },
    }) =>
      await twoFAService.verifyAndEnable2FA(
        pb,
        authorization!.replace("Bearer ", ""),
        otp,
      ),
  );

const disable2FA = forgeController
  .route("POST /disable")
  .description("Disable 2FA")
  .schema({
    response: z.void(),
  })
  .callback(async ({ pb }) => {
    if (!canDisable2FA) {
      throw new ClientError(
        "You cannot disable 2FA right now. Please try again later.",
        403,
      );
    }

    await twoFAService.disable2FA(pb);
    canDisable2FA = false;
  });

const verify2FA = forgeController
  .route("POST /verify")
  .description("Verify 2FA code")
  .schema({
    body: z.object({
      otp: z.string(),
      tid: z.string(),
      type: z.enum(["email", "app"]),
    }),
    response: z.object({
      session: z.string(),
      userData: z.record(z.string(), z.any()),
    }),
  })
  .callback(async ({ body: { otp, tid, type } }) =>
    twoFAService.verify2FA(otp, tid, type),
  );

bulkRegisterControllers(userTwoFARouter, [
  getChallenge,
  requestOTP,
  validateOTP,
  generateAuthtenticatorLink,
  verifyAndEnable2FA,
  disable2FA,
  verify2FA,
]);

export default userTwoFARouter;
