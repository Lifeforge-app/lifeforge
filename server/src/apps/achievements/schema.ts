/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: achievements
 * Generated at: 2025-07-09T12:50:41.282Z
 * Contains: achievements__entries
 */
import { z } from "zod/v4";

const AchievementsEntrySchema = z.object({
  title: z.string(),
  thoughts: z.string(),
  difficulty: z.enum(["easy", "medium", "hard", "impossible", ""]),
});

type IAchievementsEntry = z.infer<typeof AchievementsEntrySchema>;

export { AchievementsEntrySchema };

export type { IAchievementsEntry };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
