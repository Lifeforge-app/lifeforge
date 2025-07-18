import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { LocalesControllersSchemas } from "shared/types/controllers";

import * as LocalesManagerService from "../services/localesManager.service";

const localesManagerRouter = express.Router();

const listSubnamespaces = forgeController
  .route("GET /:namespace")
  .description("List subnamespaces for a namespace")
  .schema(LocalesControllersSchemas.LocalesManager.listSubnamespaces)
  .callback(async ({ params: { namespace } }) =>
    LocalesManagerService.listSubnamespaces(namespace),
  );

const listLocales = forgeController
  .route("GET /:namespace/:subnamespace")
  .description("List locales for a namespace and subnamespace")
  .schema(LocalesControllersSchemas.LocalesManager.listLocales)
  .callback(async ({ params: { namespace, subnamespace } }) =>
    LocalesManagerService.listLocales(namespace, subnamespace),
  );

const syncLocales = forgeController
  .route("POST /sync/:namespace/:subnamespace")
  .description("Sync locales for a namespace and subnamespace")
  .schema(LocalesControllersSchemas.LocalesManager.syncLocales)
  .callback(async ({ body: { data }, params: { namespace, subnamespace } }) =>
    LocalesManagerService.syncLocales(data, namespace, subnamespace),
  );

const createLocale = forgeController
  .route("POST /:type/:namespace/:subnamespace")
  .description("Create a new locale entry or folder")
  .schema(LocalesControllersSchemas.LocalesManager.createLocale)
  .statusCode(201)
  .callback(
    async ({ params: { type, namespace, subnamespace }, body: { path } }) =>
      LocalesManagerService.createLocale(type, namespace, subnamespace, path),
  );

const renameLocale = forgeController
  .route("PATCH /:namespace/:subnamespace")
  .description("Rename a locale")
  .schema(LocalesControllersSchemas.LocalesManager.renameLocale)
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
  .schema(LocalesControllersSchemas.LocalesManager.deleteLocale)
  .statusCode(204)
  .callback(async ({ params: { namespace, subnamespace }, body: { path } }) =>
    LocalesManagerService.deleteLocale(namespace, subnamespace, path),
  );

const getTranslationSuggestions = forgeController
  .route("POST /suggestions/:namespace/:subnamespace")
  .description("Get translation suggestions")
  .schema(LocalesControllersSchemas.LocalesManager.getTranslationSuggestions)
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
