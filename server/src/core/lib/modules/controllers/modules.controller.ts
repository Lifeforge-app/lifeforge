import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import _ from "lodash";
import { ModulesControllersSchemas } from "shared/types/controllers";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as ModuleService from "../services/modules.service";

const modulesRouter = express.Router();

const listAppPaths = forgeController
  .route("GET /paths")
  .description("List all application paths")
  .schema(ModulesControllersSchemas.Modules.listAppPaths)
  .callback(async () => ModuleService.listAppPaths());

const toggleModule = forgeController
  .route("POST /toggle/:id")
  .description("Toggle a module on/off")
  .schema(ModulesControllersSchemas.Modules.toggleModule)
  .callback(
    async ({ pb, params: { id } }) => await ModuleService.toggleModule(pb, id),
  );

const packageModule = forgeController
  .route("POST /package/:id")
  .description("Package a module into a zip file")
  .schema(ModulesControllersSchemas.Modules.packageModule)
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
  .schema(ModulesControllersSchemas.Modules.installModule)
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
