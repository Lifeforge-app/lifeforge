/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: codeTime
 * Generated at: 2025-07-17T08:55:29.696Z
 * Contains: code_time__projects, code_time__languages, code_time__daily_entries
 */

import { z } from "zod/v4";
const ProjectSchema = z.object({
  name: z.string(),
  duration: z.number(),
});

const LanguageSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  duration: z.number(),
});

const DailyEntrySchema = z.object({
  date: z.string(),
  relative_files: z.any(),
  projects: z.any(),
  total_minutes: z.number(),
  last_timestamp: z.number(),
  languages: z.any(),
});

type IProject = z.infer<typeof ProjectSchema>;
type ILanguage = z.infer<typeof LanguageSchema>;
type IDailyEntry = z.infer<typeof DailyEntrySchema>;

export {
  ProjectSchema,
  LanguageSchema,
  DailyEntrySchema,
};

export type {
  IProject,
  ILanguage,
  IDailyEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
