import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { CodeTimeCollectionsSchemas } from "../collections";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const CodeTime = {
  /**
   * @route       GET /activities
   * @description Get activities by year
   */
  getActivities: {
    query: z.object({
      year: z
        .string()
        .optional()
        .transform((val) =>
          val ? parseInt(val, 10) : new Date().getFullYear()
        ),
    }),
    response: CodeTimeCollectionsSchemas.CodeTimeActivitiesSchema,
  },

  /**
   * @route       GET /statistics
   * @description Get code time statistics
   */
  getStatistics: {
    response: CodeTimeCollectionsSchemas.CodeTimeStatisticsSchema,
  },

  /**
   * @route       GET /last-x-days
   * @description Get last X days of code time data
   */
  getLastXDays: {
    query: z.object({
      days: z.string().transform((val) => parseInt(val, 10)),
    }),
    response: z.array(SchemaWithPB(CodeTimeCollectionsSchemas.DailyEntry)),
  },

  /**
   * @route       GET /projects
   * @description Get projects statistics
   */
  getProjects: {
    query: z.object({
      last: z.enum(["24 hours", "7 days", "30 days"]).default("7 days"),
    }),
    response: z.record(z.string(), z.number()),
  },

  /**
   * @route       GET /languages
   * @description Get languages statistics
   */
  getLanguages: {
    query: z.object({
      last: z.enum(["24 hours", "7 days", "30 days"]).default("7 days"),
    }),
    response: z.record(z.string(), z.number()),
  },

  /**
   * @route       GET /each-day
   * @description Get each day code time data
   */
  getEachDay: {
    response: z.array(
      z.object({
        date: z.string(),
        duration: z.number(),
      })
    ),
  },

  /**
   * @route       GET /user/minutes
   * @description Get user minutes
   */
  getUserMinutes: {
    query: z.object({
      minutes: z.string().transform((val) => parseInt(val, 10)),
    }),
    response: z.object({
      minutes: z.number(),
    }),
  },

  /**
   * @route       POST /eventLog
   * @description Log a code time event
   */
  logEvent: {
    body: z.any(),
    response: z.object({
      status: z.string(),
      data: z.array(z.any()),
      message: z.string(),
    }),
  },

  /**
   * @route       GET /readme
   * @description Get readme image
   */
  getReadmeImage: {
    response: z.any(),
  },
};

type ICodeTime = InferApiESchemaDynamic<typeof CodeTime>;

export type { ICodeTime };

export { CodeTime };
