/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: passwords
 * Generated at: 2025-07-20T05:23:51.733Z
 * Contains: entry
 */

import { z } from "zod/v4";

const Entry = z.object({
  name: z.string(),
  website: z.string(),
  username: z.string(),
  password: z.string(),
  icon: z.string(),
  color: z.string(),
  pinned: z.boolean(),
});

type IEntry = z.infer<typeof Entry>;

export {
  Entry,
};

export type {
  IEntry,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
