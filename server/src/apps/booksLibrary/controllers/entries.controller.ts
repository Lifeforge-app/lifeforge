import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import { getAPIKey } from "@functions/getAPIKey";
import express from "express";
import { BooksLibrarySchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as EntriesService from "../services/entries.service";

const booksLibraryEntriesRouter = express.Router();

const getAllEntries = forgeController
  .route("GET /")
  .description("Get all entries in the books library")
  .schema({
    response: z.array(WithPBSchema(BooksLibrarySchemas.EntrySchema)),
  })
  .callback(({ pb }) => EntriesService.getAllEntries(pb));

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an existing entry in the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: BooksLibrarySchemas.EntrySchema.pick({
      title: true,
      authors: true,
      collection: true,
      edition: true,
      languages: true,
      isbn: true,
      publisher: true,
      year_published: true,
    }).extend({
      year_published: z.string().transform((val) => {
        const year = parseInt(val, 10);
        return isNaN(year) ? 0 : year;
      }),
    }),
    response: WithPBSchema(BooksLibrarySchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "books_library__entries",
  })
  .existenceCheck("body", {
    category: "[books_library_categories]",
    languages: "[books_library_languages]",
  })
  .callback(({ pb, params: { id }, body }) =>
    EntriesService.updateEntry(pb, id, body),
  );

const toggleFavouriteStatus = forgeController
  .route("POST /favourite/:id")
  .description("Toggle the favourite status of an entry in the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(BooksLibrarySchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "books_library__entries",
  })
  .callback(({ pb, params: { id } }) =>
    EntriesService.toggleFavouriteStatus(pb, id),
  );

const toggleReadStatus = forgeController
  .route("POST /read/:id")
  .description("Toggle the read status of an entry in the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(BooksLibrarySchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "books_library__entries",
  })
  .callback(async ({ pb, params: { id } }) =>
    EntriesService.toggleReadStatus(pb, id),
  );

const sendToKindle = forgeController
  .route("POST /send-to-kindle/:id")
  .description("Send an entry to a Kindle email address")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      target: z.string().email().endsWith("@kindle.com"),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "books_library__entries",
  })
  .callback(async ({ pb, params: { id }, body: { target } }) => {
    const smtpUser = await getAPIKey("smtp-user", pb);
    const smtpPassword = await getAPIKey("smtp-pass", pb);

    if (!smtpUser || !smtpPassword) {
      throw new ClientError(
        "SMTP user or password not found. Please set them in the API Keys module.",
      );
    }

    return EntriesService.sendToKindle(
      pb,
      id,
      {
        user: smtpUser,
        pass: smtpPassword,
      },
      target,
    );
  });

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete an existing entry in the books library")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "books_library__entries",
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => EntriesService.deleteEntry(pb, id));

bulkRegisterControllers(booksLibraryEntriesRouter, [
  getAllEntries,
  updateEntry,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  deleteEntry,
]);

export default booksLibraryEntriesRouter;
