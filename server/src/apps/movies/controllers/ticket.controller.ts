import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { MoviesSchemas } from "shared";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import * as TicketService from "../services/ticket.service";

const moviesTicketRouter = express.Router();

const updateTicket = forgeController
  .route("POST /")
  .description("Update ticket information for a movie entry")
  .schema({
    body: MoviesSchemas.EntrySchema.pick({
      ticket_number: true,
      theatre_number: true,
      theatre_seat: true,
      theatre_showtime: true,
    }).extend({
      entry_id: z.string(),
      theatre_location: z.object({
        displayName: z.object({
          text: z.string(),
          languageCode: z.string(),
        }),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    }),
    response: WithPBSchema(MoviesSchemas.EntrySchema),
  })
  .existenceCheck("body", {
    entry_id: "movies__entries",
  })
  .callback(({ pb, body }) => TicketService.updateTicket(pb, body));

const updateTicketPatch = forgeController
  .route("PATCH /:id")
  .description("Update ticket information for a movie entry (PATCH)")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: MoviesSchemas.EntrySchema.pick({
      ticket_number: true,
      theatre_number: true,
      theatre_seat: true,
      theatre_showtime: true,
    }).extend({
      theatre_location: z.object({
        displayName: z.object({
          text: z.string(),
          languageCode: z.string(),
        }),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    }),
    response: WithPBSchema(MoviesSchemas.EntrySchema),
  })
  .existenceCheck("params", {
    id: "movies__entries",
  })
  .callback(({ pb, params: { id }, body }) =>
    TicketService.updateTicket(pb, { ...body, entry_id: id }),
  );

const clearTicket = forgeController
  .route("DELETE /:id")
  .description("Clear ticket information for a movie entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "movies__entries",
  })
  .callback(({ pb, params: { id } }) => TicketService.clearTicket(pb, id))
  .statusCode(204);

bulkRegisterControllers(moviesTicketRouter, [
  updateTicket,
  updateTicketPatch,
  clearTicket,
]);

export default moviesTicketRouter;
