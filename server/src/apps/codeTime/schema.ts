/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: codeTime
 * Generated at: 2025-07-09T12:50:41.285Z
 * Contains: code_time__projects, code_time__languages, code_time__daily_entries
 */
import { z } from "zod/v4";

const CodeTimeProjectSchema = z.object({
  name: z.string(),
  duration: z.number(),
});

const CodeTimeLanguageSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  duration: z.number(),
});

const CodeTimeDailyEntrySchema = z.object({
  date: z.string(),
  relative_files: z.any(),
  projects: z.any(),
  total_minutes: z.number(),
  last_timestamp: z.number(),
  languages: z.any(),
});

type ICodeTimeProject = z.infer<typeof CodeTimeProjectSchema>;
type ICodeTimeLanguage = z.infer<typeof CodeTimeLanguageSchema>;
type ICodeTimeDailyEntry = z.infer<typeof CodeTimeDailyEntrySchema>;

export {
  CodeTimeProjectSchema,
  CodeTimeLanguageSchema,
  CodeTimeDailyEntrySchema,
};

export type { ICodeTimeProject, ICodeTimeLanguage, ICodeTimeDailyEntry };

// -------------------- CUSTOM SCHEMAS --------------------

const CodeTimeActivitiesSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
      level: z.number(),
    }),
  ),
  firstYear: z.number(),
});

const CodeTimeStatisticsSchema = z.object({
  "Most time spent": z.number(),
  "Total time spent": z.number(),
  "Average time spent": z.number(),
  "Longest streak": z.number(),
  "Current streak": z.number(),
});

type ICodeTimeActivities = z.infer<typeof CodeTimeActivitiesSchema>;
type ICodeTimeStatistics = z.infer<typeof CodeTimeStatisticsSchema>;

export { CodeTimeActivitiesSchema, CodeTimeStatisticsSchema };

export type { ICodeTimeActivities, ICodeTimeStatistics };
