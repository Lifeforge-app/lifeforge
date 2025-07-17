import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import z from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { BlogEntrySchema } from "../schema";

const blogEntriesRouter = express.Router();

const getAllEntries = forgeController
  .route("GET /")
  .description("Get all blog entries")
  .schema({
    response: z.array(WithPBSchema(BlogEntrySchema)),
  })
  .callback(({ pb }) => pb.collection("blog__entries").getFullList());

bulkRegisterControllers(blogEntriesRouter, [getAllEntries]);

export default blogEntriesRouter;
