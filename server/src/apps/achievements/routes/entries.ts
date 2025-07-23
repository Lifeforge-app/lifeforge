import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

export const getAllEntriesByDifficulty = forgeController
  .route('GET /:difficulty')
  .description('Get all achievements entries by difficulty')
  .input({
    params: SCHEMAS.achievements.entries.pick({
      difficulty: true
    })
  })
  .callback(async ({ pb, params: { difficulty } }) =>
    pb.getFullList
      .collection('achievements__entries')
      .filter([
        {
          field: 'difficulty',
          operator: '=',
          value: difficulty
        }
      ])
      .execute()
  )

export const createEntry = forgeController
  .route('POST /')
  .description('Create a new achievements entry')
  .input({
    body: SCHEMAS.achievements.entries
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    pb.create.collection('achievements__entries').data(body).execute()
  })

export const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing achievements entry')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.achievements.entries
  })
  .existenceCheck('params', {
    id: 'achievements__entries'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    await pb.update
      .collection('achievements__entries')
      .id(id)
      .data(body)
      .execute()
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
    await pb.delete.collection('achievements__entries').id(id).execute()
  })

export default forgeRouter({
  getAllEntriesByDifficulty,
  createEntry,
  updateEntry,
  deleteEntry
})
