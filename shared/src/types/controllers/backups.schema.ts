import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Backups = {
  /**
   * @route       GET /
   * @description List all backups
   */
  listBackups: {
    response: z.array(
      z.object({
        key: z.string(),
        size: z.number(),
        modified: z.string(),
      })
    ),
  },

  /**
   * @route       GET /download/:key
   * @description Download a specific backup
   */
  downloadBackup: {
    params: z.object({
      key: z.string(),
    }),
    response: z.any(),
  },

  /**
   * @route       POST /
   * @description Create a new backup
   */
  createBackup: {
    body: z.object({
      backupName: z.string().optional(),
    }),
    response: z.void(),
  },

  /**
   * @route       DELETE /:key
   * @description Delete a specific backup
   */
  deleteBackup: {
    params: z.object({
      key: z.string(),
    }),
    response: z.void(),
  },
};

type IBackups = InferApiESchemaDynamic<typeof Backups>;

export type { IBackups };
export { Backups };
