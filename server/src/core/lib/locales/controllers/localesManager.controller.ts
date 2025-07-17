import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { ALLOWED_LANG, ALLOWED_NAMESPACE } from "../../../constants/locales";
import * as LocalesManagerService from "../services/localesManager.service";

const localesManagerRouter = express.Router();

const listSubnamespaces = forgeController
  .route("GET /:namespace")
  .description("List subnamespaces for a namespace")
  .schema({
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
    }),
    response: z.array(z.string()),
  })
  .callback(async ({ params: { namespace } }) =>
    LocalesManagerService.listSubnamespaces(namespace),
  );

const listLocales = forgeController
  .route("GET /:namespace/:subnamespace")
  .description("List locales for a namespace and subnamespace")
  .schema({
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    response: z.record(z.enum(ALLOWED_LANG).exclude(["zh"]), z.string()),
  })
  .callback(async ({ params: { namespace, subnamespace } }) =>
    LocalesManagerService.listLocales(namespace, subnamespace),
  );

const syncLocales = forgeController
  .route("POST /sync/:namespace/:subnamespace")
  .description("Sync locales for a namespace and subnamespace")
  .schema({
    body: z.object({
      data: z.record(
        z.string(),
        z.record(z.enum(ALLOWED_LANG).exclude(["zh"]), z.string()),
      ),
    }),
    params: z.object({
      namespace: z.enum(["apps", "common", "utils", "core"]),
      subnamespace: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(async ({ body: { data }, params: { namespace, subnamespace } }) =>
    LocalesManagerService.syncLocales(data, namespace, subnamespace),
  );

const createLocale = forgeController
  .route("POST /:type/:namespace/:subnamespace")
  .description("Create a new locale entry or folder")
  .schema({
    params: z.object({
      type: z.enum(["entry", "folder"]),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    body: z.object({
      path: z.string().optional().default(""),
    }),
    response: z.boolean(),
  })
  .statusCode(201)
  .callback(
    async ({ params: { type, namespace, subnamespace }, body: { path } }) =>
      LocalesManagerService.createLocale(type, namespace, subnamespace, path),
  );

const renameLocale = forgeController
  .route("PATCH /:namespace/:subnamespace")
  .description("Rename a locale")
  .schema({
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    body: z.object({
      path: z.string().optional().default(""),
      newName: z.string().optional().default(""),
    }),
    response: z.boolean(),
  })
  .callback(
    async ({ params: { namespace, subnamespace }, body: { path, newName } }) =>
      LocalesManagerService.renameLocale(
        namespace,
        subnamespace,
        path,
        newName,
      ),
  );

const deleteLocale = forgeController
  .route("DELETE /:namespace/:subnamespace")
  .description("Delete a locale")
  .schema({
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    body: z.object({
      path: z.string().optional().default(""),
    }),
    response: z.boolean(),
  })
  .statusCode(204)
  .callback(async ({ params: { namespace, subnamespace }, body: { path } }) =>
    LocalesManagerService.deleteLocale(namespace, subnamespace, path),
  );

const getTranslationSuggestions = forgeController
  .route("POST /suggestions/:namespace/:subnamespace")
  .description("Get translation suggestions")
  .schema({
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string(),
    }),
    body: z.object({
      path: z.string(),
      hint: z.string().optional().default(""),
    }),
    response: z.object({
      en: z.string(),
      ms: z.string(),
      "zh-CN": z.string(),
      "zh-TW": z.string(),
    }),
  })
  .callback(
    async ({ pb, params: { namespace, subnamespace }, body: { path, hint } }) =>
      await LocalesManagerService.getTranslationSuggestions(
        namespace,
        subnamespace,
        path,
        hint,
        pb,
      ),
  );

bulkRegisterControllers(localesManagerRouter, [
  listSubnamespaces,
  listLocales,
  syncLocales,
  getTranslationSuggestions,
  createLocale,
  renameLocale,
  deleteLocale,
]);

export default localesManagerRouter;
