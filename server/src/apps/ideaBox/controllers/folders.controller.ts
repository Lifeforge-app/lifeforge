import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { IdeaBoxSchemas } from "shared";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as foldersService from "../services/folders.service";

const ideaBoxFoldersRouter = express.Router();

const getFolders = forgeController
  .route("GET /:container/*")
  .description("Get folders from a container path")
  .schema({
    params: z.object({
      container: z.string(),
      "0": z.string(),
    }),
    response: z.array(WithPBSchema(IdeaBoxSchemas.FolderSchema)),
  })
  .existenceCheck("params", {
    container: "idea_box__containers",
  })
  .callback(async ({ pb, params }) => {
    const { container } = params;
    const path = params[0].split("/").filter((p) => p !== "");

    const { folderExists, lastFolder } =
      await foldersService.validateFolderPath(pb, container, path);

    if (!folderExists) {
      throw new ClientError(
        `Folder with path "${params[0]}" does not exist in container "${container}"`,
      );
    }

    return await foldersService.getFolders(pb, container, lastFolder);
  });

const createFolder = forgeController
  .route("POST /")
  .description("Create a new folder")
  .schema({
    body: z.object({
      name: z.string(),
      container: z.string(),
      parent: z.string(),
      icon: z.string(),
      color: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.FolderSchema),
  })
  .existenceCheck("body", {
    container: "idea_box__containers",
  })
  .callback(async ({ pb, body }) => await foldersService.createFolder(pb, body))
  .statusCode(201);

const updateFolder = forgeController
  .route("PATCH /:id")
  .description("Update a folder")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.FolderSchema),
  })
  .existenceCheck("params", {
    id: "idea_box__folders",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await foldersService.updateFolder(pb, id, body),
  );

const moveFolder = forgeController
  .route("POST /move/:id")
  .description("Move a folder to a different parent")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      target: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.FolderSchema),
  })
  .existenceCheck("params", {
    id: "idea_box__folders",
  })
  .existenceCheck("query", {
    target: "idea_box__folders",
  })
  .callback(
    async ({ pb, params: { id }, query: { target } }) =>
      await foldersService.moveFolder(pb, id, target),
  );

const removeFromFolder = forgeController
  .route("DELETE /move/:id")
  .description("Remove a folder from its parent")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.FolderSchema),
  })
  .existenceCheck("params", {
    id: "idea_box__folders",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await foldersService.removeFromFolder(pb, id),
  );

const deleteFolder = forgeController
  .route("DELETE /:id")
  .description("Delete a folder")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "idea_box__folders",
  })
  .callback(
    async ({ pb, params: { id } }) => await foldersService.deleteFolder(pb, id),
  )
  .statusCode(204);

bulkRegisterControllers(ideaBoxFoldersRouter, [
  getFolders,
  createFolder,
  updateFolder,
  moveFolder,
  removeFromFolder,
  deleteFolder,
]);

export default ideaBoxFoldersRouter;
