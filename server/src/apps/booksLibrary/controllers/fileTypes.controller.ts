import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { BooksLibrarySchemas } from "shared";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as FileTypesService from "../services/fileTypes.service";

const booksLibraryFileTypesRouter = express.Router();

const getAllFileTypes = forgeController
  .route("GET /")
  .description("Get all file types for the books library")
  .schema({
    response: z.array(WithPBSchema(BooksLibrarySchemas.FileTypeSchema)),
  })
  .callback(async ({ pb }) => await FileTypesService.getAllFileTypes(pb));

bulkRegisterControllers(booksLibraryFileTypesRouter, [getAllFileTypes]);

export default booksLibraryFileTypesRouter;
