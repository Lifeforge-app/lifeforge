import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import _ from "lodash";
import { z } from "zod/v4";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as ModuleService from "../services/modules.service";

const modulesRouter = express.Router();

const listAppPaths = forgeController
  .route("GET /paths")
  .description("List all application paths")
  .schema({
    response: z.array(z.string()),
  })
  .callback(async () => ModuleService.listAppPaths());

const toggleModule = forgeController
  .route("POST /toggle/:id")
  .description("Toggle a module on/off")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .callback(
    async ({ pb, params: { id } }) => await ModuleService.toggleModule(pb, id),
  );

const packageModule = forgeController
  .route("POST /package/:id")
  .description("Package a module into a zip file")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .noDefaultResponse()
  .callback(async ({ params: { id }, res }) => {
    const backendZip = await ModuleService.packageModule(id);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${_.kebabCase(id)}.zip"`,
    );
    res.setHeader("Content-Length", backendZip.length);

    // @ts-expect-error - Custom response
    res.send(backendZip);
  });

const installModule = forgeController
  .route("POST /install")
  .description("Install a module from uploaded file")
  .middlewares(singleUploadMiddleware)
  .schema({
    body: z.object({
      name: z.string().min(1, "Name is required"),
    }),
    response: z.void(),
  })
  .callback(async ({ body: { name }, req: { file } }) =>
    ModuleService.installModule(name, file),
  );

bulkRegisterControllers(modulesRouter, [
  listAppPaths,
  toggleModule,
  packageModule,
  installModule,
]);

export default modulesRouter;
