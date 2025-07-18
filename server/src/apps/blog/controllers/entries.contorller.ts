import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { BlogSchemas } from "shared/types";
import z from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

const blogEntriesRouter = express.Router();

const getAllEntries = forgeController
  .route("GET /")
  .description("Get all blog entries")
  .schema({
    response: z.array(WithPBSchema(BlogSchemas.EntrySchema)),
  })
  .callback(({ pb }) => pb.collection("blog__entries").getFullList());

bulkRegisterControllers(blogEntriesRouter, [getAllEntries]);

export default blogEntriesRouter;
