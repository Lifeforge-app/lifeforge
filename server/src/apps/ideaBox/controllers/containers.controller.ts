import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import fs from "fs";
import { IdeaBoxSchemas } from "shared";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { singleUploadMiddlewareOfKey } from "@middlewares/uploadMiddleware";

import * as containersService from "../services/containers.service";

const ideaBoxContainersRouter = express.Router();

const checkContainerExists = forgeController
  .route("GET /valid/:id")
  .description("Check if a container exists")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.boolean(),
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await containersService.checkContainerExists(pb, id),
  );

const getContainers = forgeController
  .route("GET /")
  .description("Get all containers")
  .schema({
    response: z.array(WithPBSchema(IdeaBoxSchemas.ContainerSchema)),
  })
  .callback(async ({ pb }) => await containersService.getContainers(pb));

const createContainer = forgeController
  .route("POST /")
  .description("Create a new container")
  .schema({
    body: IdeaBoxSchemas.ContainerSchema,
    response: WithPBSchema(IdeaBoxSchemas.ContainerSchema),
  })
  .middlewares(singleUploadMiddlewareOfKey("cover"))
  .callback(async ({ pb, body: { name, color, icon, cover }, req }) => {
    const container = await containersService.createContainer(
      pb,
      name,
      color,
      icon,
      await (async () => {
        if (req.file) {
          return new File([fs.readFileSync(req.file.path)], req.file.filename);
        }

        if (cover) {
          const response = await fetch(cover);
          const fileBuffer = await response.arrayBuffer();

          return new File([fileBuffer], "cover.jpg");
        }

        return undefined;
      })(),
    );

    if (container.cover) {
      container.cover = pb.files
        .getURL(container, container.cover)
        .replace(`${pb.baseURL}/api/files`, "");
    }

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    return container;
  })
  .statusCode(201);

const updateContainer = forgeController
  .route("PATCH /:id")
  .description("Update a container")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      cover: z.string().optional(),
    }),
    response: WithPBSchema(IdeaBoxSchemas.ContainerSchema),
  })
  .middlewares(singleUploadMiddlewareOfKey("cover"))
  .existenceCheck("params", {
    id: "idea_box__containers",
  })
  .callback(
    async ({ pb, params: { id }, body: { name, icon, color, cover }, req }) => {
      const container = await containersService.updateContainer(
        pb,
        id,
        name,
        color,
        icon,
        await (async () => {
          if (req.file) {
            return new File(
              [fs.readFileSync(req.file.path)],
              req.file.filename,
            );
          }

          if (cover === "keep") {
            return "keep";
          }

          if (cover) {
            const response = await fetch(cover);
            const fileBuffer = await response.arrayBuffer();

            return new File([fileBuffer], "cover.jpg");
          }

          return undefined;
        })(),
      );

      if (container.cover) {
        container.cover = pb.files
          .getURL(container, container.cover)
          .replace(`${pb.baseURL}/api/files`, "");
      }

      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return container;
    },
  );

const deleteContainer = forgeController
  .route("DELETE /:id")
  .description("Delete a container")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "idea_box__containers",
  })
  .callback(async ({ pb, params: { id } }) =>
    containersService.deleteContainer(pb, id),
  )
  .statusCode(204);

bulkRegisterControllers(ideaBoxContainersRouter, [
  checkContainerExists,
  getContainers,
  createContainer,
  updateContainer,
  deleteContainer,
]);

export default ideaBoxContainersRouter;
