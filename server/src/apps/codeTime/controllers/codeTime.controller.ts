import ClientError from "@functions/ClientError";
import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import {
  CodeTimeActivitiesSchema,
  CodeTimeDailyEntrySchema,
  CodeTimeStatisticsSchema,
} from "../schema";
import * as CodeTimeService from "../services/codeTime.service";

const codeTimeRouter = express.Router();

const getActivities = forgeController
  .route("GET /activities")
  .description("Get activities by year")
  .schema({
    query: z.object({
      year: z
        .string()
        .optional()
        .transform((val) =>
          val ? parseInt(val, 10) : new Date().getFullYear(),
        ),
    }),
    response: CodeTimeActivitiesSchema,
  })
  .callback(
    async ({ pb, query: { year } }) =>
      await CodeTimeService.getActivities(pb, year),
  );

const getStatistics = forgeController
  .route("GET /statistics")
  .description("Get code time statistics")
  .schema({
    response: CodeTimeStatisticsSchema,
  })
  .callback(async ({ pb }) => await CodeTimeService.getStatistics(pb));

const getLastXDays = forgeController
  .route("GET /last-x-days")
  .description("Get last X days of code time data")
  .schema({
    query: z.object({
      days: z.string().transform((val) => parseInt(val, 10)),
    }),
    response: z.array(WithPBSchema(CodeTimeDailyEntrySchema)),
  })
  .callback(async ({ pb, query: { days } }) => {
    if (days > 30) {
      throw new ClientError("days must be less than or equal to 30");
    }

    return await CodeTimeService.getLastXDays(pb, days);
  });

const getProjects = forgeController
  .route("GET /projects")
  .description("Get projects statistics")
  .schema({
    query: z.object({
      last: z.enum(["24 hours", "7 days", "30 days"]).default("7 days"),
    }),
    response: z.record(z.string(), z.number()),
  })
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getProjectsStats(pb, last),
  );

const getLanguages = forgeController
  .route("GET /languages")
  .description("Get languages statistics")
  .schema({
    query: z.object({
      last: z.enum(["24 hours", "7 days", "30 days"]).default("7 days"),
    }),
    response: z.record(z.string(), z.number()),
  })
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getLanguagesStats(pb, last),
  );

const getEachDay = forgeController
  .route("GET /each-day")
  .description("Get each day code time data")
  .schema({
    response: z.array(
      z.object({
        date: z.string(),
        duration: z.number(),
      }),
    ),
  })
  .callback(async ({ pb }) => await CodeTimeService.getEachDay(pb));

const getUserMinutes = forgeController
  .route("GET /user/minutes")
  .description("Get user minutes")
  .schema({
    query: z.object({
      minutes: z.string().transform((val) => parseInt(val, 10)),
    }),
    response: z.object({
      minutes: z.number(),
    }),
  })
  .callback(
    async ({ pb, query: { minutes } }) =>
      await CodeTimeService.getUserMinutes(pb, minutes),
  );

const logEvent = forgeController
  .route("POST /eventLog")
  .description("Log a code time event")
  .schema({
    // @ts-ignore
    body: z.any(),
    response: z.object({
      status: z.string(),
      data: z.array(z.any()),
      message: z.string(),
    }),
  })
  .callback(async ({ pb, body }) => {
    await CodeTimeService.logEvent(pb, body);

    return {
      status: "ok",
      data: [],
      message: "success",
    };
  });

const getReadmeImage = forgeController
  .route("GET /readme")
  .description("Get readme image")
  .schema({
    response: z.any(),
  })
  .noDefaultResponse()
  .callback(async ({ pb, res }) => {
    const imageBuffer = await CodeTimeService.getReadmeImage(pb);

    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Content-Type", "image/png");

    // @ts-expect-error
    res.status(200).send(imageBuffer);
  });

bulkRegisterControllers(codeTimeRouter, [
  getActivities,
  getStatistics,
  getLastXDays,
  getProjects,
  getLanguages,
  getEachDay,
  getUserMinutes,
  logEvent,
  getReadmeImage,
]);

export default codeTimeRouter;
