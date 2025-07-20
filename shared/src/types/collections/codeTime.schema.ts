/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: codeTime
 * Generated at: 2025-07-20T05:29:45.173Z
 * Contains: project, language, daily_entry
 */

import { z } from "zod/v4";

const Project = z.object({
  name: z.string(),
  duration: z.number(),
});

const Language = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  duration: z.number(),
});

const DailyEntry = z.object({
  date: z.string(),
  relative_files: z.any(),
  projects: z.any(),
  total_minutes: z.number(),
  last_timestamp: z.number(),
  languages: z.any(),
});

type IProject = z.infer<typeof Project>;
type ILanguage = z.infer<typeof Language>;
type IDailyEntry = z.infer<typeof DailyEntry>;

export {
  Project,
  Language,
  DailyEntry,
};

export type {
  IProject,
  ILanguage,
  IDailyEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

const CodeTimeActivitiesSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
      level: z.number()
    })
  ),
  firstYear: z.number()
})

const CodeTimeStatisticsSchema = z.object({
  'Most time spent': z.number(),
  'Total time spent': z.number(),
  'Average time spent': z.number(),
  'Longest streak': z.number(),
  'Current streak': z.number()
})

type ICodeTimeActivities = z.infer<typeof CodeTimeActivitiesSchema>
type ICodeTimeStatistics = z.infer<typeof CodeTimeStatisticsSchema>

export { CodeTimeActivitiesSchema, CodeTimeStatisticsSchema }

export type { ICodeTimeActivities, ICodeTimeStatistics }
