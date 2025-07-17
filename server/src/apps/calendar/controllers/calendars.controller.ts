import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { CalendarCalendarSchema } from "../schema";
import * as CalendarsService from "../services/calendars.service";

const calendarCalendarsRouter = express.Router();

const getAllCalendars = forgeController
  .route("GET /")
  .description("Get all calendars")
  .schema({
    response: z.array(WithPBSchema(CalendarCalendarSchema)),
  })
  .callback(async ({ pb }) => await CalendarsService.getAllCalendars(pb));

const getCalendarById = forgeController
  .route("GET /:id")
  .description("Get a calendar by ID")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(CalendarCalendarSchema),
  })
  .existenceCheck("params", {
    id: "calendar__calendars",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await CalendarsService.getCalendarById(pb, id),
  );

const createCalendar = forgeController
  .route("POST /")
  .description("Create a new calendar")
  .schema({
    body: CalendarCalendarSchema,
    response: WithPBSchema(CalendarCalendarSchema),
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (
      await pb
        .collection("calendar__calendars")
        .getFirstListItem(`name="${body.name}"`)
        .catch(() => null)
    ) {
      throw new ClientError("Calendar with this name already exists");
    }

    return await CalendarsService.createCalendar(pb, body);
  });

const updateCalendar = forgeController
  .route("PATCH /:id")
  .description("Update an existing calendar")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: CalendarCalendarSchema,
    response: WithPBSchema(CalendarCalendarSchema),
  })
  .existenceCheck("params", {
    id: "calendar__calendars",
  })
  .callback(async ({ pb, params: { id }, body }) => {
    if (
      await pb
        .collection("calendar__calendars")
        .getFirstListItem(`name="${body.name}" && id != "${id}"`)
        .catch(() => null)
    ) {
      throw new ClientError("Calendar with this name already exists");
    }

    return await CalendarsService.updateCalendar(pb, id, body);
  });

const deleteCalendar = forgeController
  .route("DELETE /:id")
  .description("Delete an existing calendar")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "calendar__calendars",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await CalendarsService.deleteCalendar(pb, id),
  );

bulkRegisterControllers(calendarCalendarsRouter, [
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
]);

export default calendarCalendarsRouter;
