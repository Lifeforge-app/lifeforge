import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { CalendarSchemas } from "shared/types";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as EventsService from "../services/events.service";

const calendarEventsRouter = express.Router();

const getEventsByDateRange = forgeController
  .route("GET /")
  .description("Get events by date range")
  .schema({
    query: z.object({
      start: z.string(),
      end: z.string(),
    }),
    response: z.array(WithPBSchema(CalendarSchemas.EventSchema.partial())),
  })
  .callback(
    async ({ pb, query: { start, end } }) =>
      await EventsService.getEventsByDateRange(pb, start, end),
  );

const getEventsToday = forgeController
  .route("GET /today")
  .description("Get today's events")
  .schema({
    response: z.array(WithPBSchema(CalendarSchemas.EventSchema.partial())),
  })
  .callback(async ({ pb }) => await EventsService.getTodayEvents(pb));

const getEventById = forgeController
  .route("GET /:id")
  .description("Get an event by ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(CalendarSchemas.EventSchema),
  })
  .existenceCheck("params", {
    id: "calendar__events",
  })
  .callback(
    async ({ pb, params: { id } }) => await EventsService.getEventById(pb, id),
  );

const createEvent = forgeController
  .route("POST /")
  .description("Create a new event")
  .schema({
    body: CalendarSchemas.EventSchema.omit({
      exceptions: true,
    }).extend({
      location: z
        .union([
          z.object({
            displayName: z.object({
              text: z.string(),
            }),
          }),
          z.string(),
        ])
        .optional(),
    }),
    response: WithPBSchema(CalendarSchemas.EventSchema),
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (body.type === "recurring" && !body.recurring_rrule) {
      throw new ClientError("Recurring events must have a recurring rule");
    }

    return await EventsService.createEvent(pb, body);
  });

const scanImage = forgeController
  .route("POST /scan-image")
  .description("Scan an image to extract event data")
  .middlewares(singleUploadMiddleware)
  .schema({
    response: CalendarSchemas.EventSchema.partial(),
  })
  .callback(async ({ pb, req }) => {
    const { file } = req;

    if (!file) {
      throw new ClientError("No file uploaded");
    }

    const eventData = await EventsService.scanImage(pb, file.path);

    if (!eventData) {
      throw new Error("Failed to scan image");
    }

    return eventData;
  });

const addException = forgeController
  .route("POST /exception/:id")
  .description("Add an exception to a recurring event")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      date: z.string(),
    }),
    response: z.boolean(),
  })
  .existenceCheck("params", {
    id: "calendar__events",
  })
  .callback(
    async ({ pb, params: { id }, body: { date } }) =>
      await EventsService.addException(pb, id, date),
  );

const updateEvent = forgeController
  .route("PATCH /:id")
  .description("Update an existing event")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: CalendarSchemas.EventSchema.partial().omit({
      exceptions: true,
    }),
    response: WithPBSchema(CalendarSchemas.EventSchema),
  })
  .existenceCheck("params", {
    id: "calendar__events",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await EventsService.updateEvent(pb, id.split("-")[0], body),
  );

const deleteEvent = forgeController
  .route("DELETE /:id")
  .description("Delete an existing event")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "calendar__events",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await EventsService.deleteEvent(pb, id),
  );

bulkRegisterControllers(calendarEventsRouter, [
  getEventsByDateRange,
  getEventsToday,
  getEventById,
  createEvent,
  addException,
  updateEvent,
  deleteEvent,
  scanImage,
]);

export default calendarEventsRouter;
