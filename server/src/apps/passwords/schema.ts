/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: passwords
 * Generated at: 2025-07-09T12:50:41.283Z
 * Contains: passwords__entries
 */
import { z } from "zod/v4";

const PasswordsEntrySchema = z.object({
  name: z.string(),
  website: z.string(),
  username: z.string(),
  password: z.string(),
  icon: z.string(),
  color: z.string(),
  pinned: z.boolean(),
});

type IPasswordsEntry = z.infer<typeof PasswordsEntrySchema>;

export { PasswordsEntrySchema };

export type { IPasswordsEntry };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
