/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: codeTime
 * Generated at: 2025-07-18T10:36:14.106Z
 * Contains: code_time__projects, code_time__languages, code_time__daily_entries
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

// Add your custom schemas here. They will not be overwritten by this script.
