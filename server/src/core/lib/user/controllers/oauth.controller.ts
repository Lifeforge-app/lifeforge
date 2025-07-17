import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import * as OAuthService from "../services/oauth.service";

const userOAuthRouter = express.Router();

const listOAuthProviders = forgeController
  .route("GET /providers")
  .description("List available OAuth providers")
  .schema({
    response: z.array(z.string()),
  })
  .callback(async () => await OAuthService.listOAuthProviders());

const getOAuthEndpoint = forgeController
  .route("GET /endpoint")
  .description("Get OAuth endpoint for a provider")
  .schema({
    query: z.object({
      provider: z.string(),
    }),
    response: z.record(z.string(), z.any()),
  })
  .callback(
    async ({ pb, query: { provider } }) =>
      await OAuthService.getOAuthEndpoint(pb, provider),
  );

const oauthVerify = forgeController
  .route("POST /verify")
  .description("Verify OAuth callback")
  .schema({
    body: z.object({
      provider: z.string(),
      code: z.string(),
    }),
    response: z.union([
      z.string(),
      z.object({
        state: z.string(),
        tid: z.string(),
      }),
    ]),
  })
  .callback(
    async ({ pb, body, req }) =>
      await OAuthService.oauthVerify(pb, {
        ...body,
        origin: req.headers.origin || "",
      }),
  );

bulkRegisterControllers(userOAuthRouter, [
  listOAuthProviders,
  getOAuthEndpoint,
  oauthVerify,
]);

export default userOAuthRouter;
