import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import {
  AchievementsCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

export const getAllEntriesByDifficulty = forgeController
  .route('GET /:difficulty')
  .description('Get all achievements entries by difficulty')
  .input({
    params: AchievementsCollectionsSchemas.Entry.pick({
      difficulty: true
    })
  })
  .callback(({ pb, params: { difficulty } }) =>
    pb
      .collection('achievements__entries')
      .getFullList<ISchemaWithPB<AchievementsCollectionsSchemas.IEntry>>({
        filter: `difficulty = "${difficulty}"`,
        sort: '-created'
      })
  )

export const createEntry = forgeController
  .route('POST /')
  .description('Create a new achievements entry')
  .input({
    body: AchievementsCollectionsSchemas.Entry
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    pb.collection('achievements__entries').create<
      ISchemaWithPB<AchievementsCollectionsSchemas.IEntry>
    >(body)
  })

export const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing achievements entry')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: AchievementsCollectionsSchemas.Entry
  })
  .existenceCheck('params', {
    id: 'achievements__entries'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    await pb.collection('achievements__entries').update(id, body)
  })

export const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete an existing achievements entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'achievements__entries'
  })
  .statusCode(204)
  .callback(async ({ pb, params: { id } }) => {
    await pb.collection('achievements__entries').delete(id)
  })

export default forgeRouter({
  getAllEntriesByDifficulty,
  createEntry,
  updateEntry,
  deleteEntry
})
