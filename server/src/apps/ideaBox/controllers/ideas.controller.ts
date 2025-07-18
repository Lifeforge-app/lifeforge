import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import multer from "multer";
import { IdeaBoxSchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as ideasService from "../services/ideas.service";

const ideaBoxIdeasRouter = express.Router();

const getIdeas = forgeController
  .route("GET /:container/*")
  .description("Get ideas from a folder")
  .schema({
    params: z.object({
      container: z.string(),
      "0": z.string(),
    }),
    query: z.object({
      archived: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    }),
    response: z.array(WithPBSchema(IdeaBoxSchemas.EntrySchema)),
  })
  .existenceCheck("params", {
    container: "idea_box__containers",
  })
  .callback(
    async ({
      pb,
      params: { "0": pathParam, container },
      query: { archived },
    }) => {
      const path = pathParam.split("/").filter((e) => e);

      const { folderExists, lastFolder } =
        await ideasService.validateFolderPath(pb, container, path);

      if (!folderExists) {
        throw new ClientError(
          `Folder with path "${pathParam}" does not exist in container "${container}"`,
        );
      }

      return await ideasService.getIdeas(pb, container, lastFolder, archived);
    },
  );

const createIdea = forgeController
  .route("POST /")
  .description("Create a new idea")
  .schema({
    body: IdeaBoxSchemas.EntrySchema.pick({
      type: true,
      container: true,
      folder: true,
      title: true,
      content: true,
      tags: true,
    }).extend({
      imageLink: z.string().optional(),
      tags: z.string().transform((val) => JSON.parse(val)),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .middlewares(multer().single("image") as any)
  .existenceCheck("body", {
    container: "idea_box__containers",
  })
  .callback(
    async ({
      pb,
      body: { type, container, folder, title, content, imageLink, tags },
      req,
    }) => {
      const { file } = req;

      let data: Omit<IdeaBoxSchemas.IEntry, "image" | "archived" | "pinned"> & {
        image?: File;
      } = {
        title: "",
        content: "",
        type,
        container,
        folder,
        tags: tags || null,
      };

      switch (type) {
        case "text":
        case "link":
          data["title"] = title;
          data["content"] = content;
          break;
        case "image":
          if (imageLink) {
            const response = await fetch(imageLink);
            const buffer = await response.arrayBuffer();
            data["image"] = new File([buffer], "image.jpg", {
              type: "image/jpeg",
            });
            data["title"] = title;
          } else {
            if (!file) {
              throw new ClientError(
                "Image file is required for image type ideas",
              );
            }

            data["image"] = new File([file.buffer], file.originalname, {
              type: file.mimetype,
            });
            data["title"] = title;
          }
          break;
      }

      return await ideasService.createIdea(pb, data);
    },
  )
  .statusCode(201);

const updateIdea = forgeController
  .route("PATCH /:id")
  .description("Update an idea")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      type: z.enum(["text", "link", "image"]),
      tags: z.array(z.string()).optional(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id }, body: { title, content, type, tags } }) => {
      let data;
      switch (type) {
        case "text":
        case "link":
          data = {
            title,
            content,
            type,
            tags: tags || null,
          };
          break;
        case "image":
          data = {
            title,
            type,
            tags: tags || null,
          };
          break;
      }

      return await ideasService.updateIdea(pb, id, data as any);
    },
  );

const deleteIdea = forgeController
  .route("DELETE /:id")
  .description("Delete an idea")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id } }) => await ideasService.deleteIdea(pb, id),
  )
  .statusCode(204);

const pinIdea = forgeController
  .route("POST /pin/:id")
  .description("Pin/unpin an idea")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await ideasService.updatePinStatus(pb, id),
  );

const archiveIdea = forgeController
  .route("POST /archive/:id")
  .description("Archive/unarchive an idea")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await ideasService.updateArchiveStatus(pb, id),
  );

const moveIdea = forgeController
  .route("POST /move/:id")
  .description("Move an idea to a different folder")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      target: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .existenceCheck("query", {
    target: "idea_box__folders",
  })
  .callback(
    async ({ pb, params: { id }, query: { target } }) =>
      await ideasService.moveIdea(pb, id, target),
  );

const removeFromFolder = forgeController
  .route("DELETE /move/:id")
  .description("Remove an idea from its current folder")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "idea_box__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await ideasService.removeFromFolder(pb, id),
  );

bulkRegisterControllers(ideaBoxIdeasRouter, [
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  pinIdea,
  archiveIdea,
  moveIdea,
  removeFromFolder,
]);

export default ideaBoxIdeasRouter;
