import { z } from 'zod/v4'

import { AchievementsCollectionsSchemas } from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Entries = {
  /**
   * @route       GET /:difficulty
   * @description Get all achievements entries by difficulty
   */
  getAllEntriesByDifficulty: {
    params: AchievementsCollectionsSchemas.Entry.pick({
      difficulty: true
    }),
    response: z.array(SchemaWithPB(AchievementsCollectionsSchemas.Entry))
  },

  /**
   * @route       POST /
   * @description Create a new achievements entry
   */
  createEntry: {
    body: AchievementsCollectionsSchemas.Entry,
    response: SchemaWithPB(AchievementsCollectionsSchemas.Entry)
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing achievements entry
   */
  updateEntry: {
    params: z.object({
      id: z.string()
    }),
    body: AchievementsCollectionsSchemas.Entry,
    response: SchemaWithPB(AchievementsCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /:id
   * @description Delete an existing achievements entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

type IEntries = InferApiESchemaDynamic<typeof Entries>

export type { IEntries }

export { Entries }
