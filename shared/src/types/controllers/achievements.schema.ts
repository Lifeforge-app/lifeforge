import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const Entries = {
  /**
   * @route       GET /:difficulty
   * @description Get all achievements entries by difficulty
   */
  getAllEntriesByDifficulty: {
    params: AchievementsSchemas.EntrySchema.pick({
      difficulty: true,
    }),
    response: z.array(SchemaWithPB(AchievementsSchemas.EntrySchema)),
  },

  /**
   * @route       POST /
   * @description Create a new achievements entry
   */
  createEntry: {
    body: AchievementsSchemas.EntrySchema,
    response: SchemaWithPB(AchievementsSchemas.EntrySchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing achievements entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: AchievementsSchemas.EntrySchema,
    response: SchemaWithPB(AchievementsSchemas.EntrySchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing achievements entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type IEntries = z.infer<typeof Entries>;

export type { IEntries };
export { Entries };
