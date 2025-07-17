/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: codeTime
 * Generated at: 2025-07-17T08:55:29.696Z
 * Contains: code_time__projects, code_time__languages, code_time__daily_entries
 */
import { z } from 'zod/v4'

const ProjectSchema = z.object({
  name: z.string(),
  duration: z.number()
})

const LanguageSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  duration: z.number()
})

const DailyEntrySchema = z.object({
  date: z.string(),
  relative_files: z.any(),
  projects: z.any(),
  total_minutes: z.number(),
  last_timestamp: z.number(),
  languages: z.any()
})

type IProject = z.infer<typeof ProjectSchema>
type ILanguage = z.infer<typeof LanguageSchema>
type IDailyEntry = z.infer<typeof DailyEntrySchema>

export { ProjectSchema, LanguageSchema, DailyEntrySchema }

export type { IProject, ILanguage, IDailyEntry }

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
