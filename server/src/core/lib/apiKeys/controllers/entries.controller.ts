import { decrypt2 } from "@functions/encryption";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { ApiKeysControllersSchemas } from "shared/types/controllers";

import { challenge } from "../services/auth.service";
import getDecryptedMaster, * as entriesService from "../services/entries.service";

const apiKeysEntriesRouter = express.Router();

const getAllEntries = forgeController
  .route("GET /")
  .description("Get all API key entries")
  .schema(ApiKeysControllersSchemas.Entries.getAllEntries)
  .callback(async ({ pb, query: { master } }) => {
    await getDecryptedMaster(pb, decodeURIComponent(master));
    return await entriesService.getAllEntries(pb);
  });

const checkKeys = forgeController
  .route("GET /check")
  .description("Check if API keys exist")
  .schema(ApiKeysControllersSchemas.Entries.checkKeys)
  .callback(
    async ({ pb, query: { keys } }) => await entriesService.checkKeys(pb, keys),
  );

const getEntryById = forgeController
  .route("GET /:id")
  .description("Get API key entry by ID")
  .schema(ApiKeysControllersSchemas.Entries.getEntryById)
  .existenceCheck("params", {
    id: "api_keys__entries",
  })
  .callback(async ({ pb, params: { id }, query: { master } }) => {
    const decryptedMaster = await getDecryptedMaster(
      pb,
      decodeURIComponent(master),
    );

    return await entriesService.getEntryById(pb, id, decryptedMaster);
  });

const createEntry = forgeController
  .route("POST /")
  .description("Create a new API key entry")
  .schema(ApiKeysControllersSchemas.Entries.createEntry)
  .statusCode(201)
  .callback(async ({ pb, body: { data } }) => {
    const decryptedData = JSON.parse(decrypt2(data, challenge));

    const { keyId, name, description, icon, key, master } = decryptedData;

    const decryptedMaster = await getDecryptedMaster(pb, master);

    return await entriesService.createEntry(pb, {
      keyId,
      name,
      description,
      icon,
      key,
      decryptedMaster,
    });
  });

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an API key entry")
  .schema(ApiKeysControllersSchemas.Entries.updateEntry)
  .existenceCheck("params", {
    id: "api_keys__entries",
  })
  .callback(async ({ pb, params: { id }, body: { data } }) => {
    const decryptedData = JSON.parse(decrypt2(data, challenge));

    const { keyId, name, description, icon, key, master } = decryptedData;

    const decryptedMaster = await getDecryptedMaster(pb, master);

    return await entriesService.updateEntry(pb, id, {
      keyId,
      name,
      description,
      icon,
      key,
      decryptedMaster,
    });
  });

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete an API key entry")
  .schema(ApiKeysControllersSchemas.Entries.deleteEntry)
  .existenceCheck("params", {
    id: "api_keys__entries",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id),
  );

bulkRegisterControllers(apiKeysEntriesRouter, [
  getAllEntries,
  checkKeys,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
]);

export default apiKeysEntriesRouter;
