import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { ALLOWED_LANG, ALLOWED_NAMESPACE } from "../../../constants/locales";
import * as LocalesService from "../services/locales.service";

const localesRouter = express.Router();

const getLocales = forgeController
  .route("GET /:lang/:namespace/:subnamespace")
  .description(
    "Get locales for a specific language, namespace, and subnamespace",
  )
  .schema({
    params: z.object({
      lang: z.enum(ALLOWED_LANG),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    response: z.any(),
  })
  .callback(async ({ params: { lang, namespace, subnamespace } }) =>
    LocalesService.getLocales(lang, namespace, subnamespace),
  );

bulkRegisterControllers(localesRouter, [getLocales]);

export default localesRouter;
