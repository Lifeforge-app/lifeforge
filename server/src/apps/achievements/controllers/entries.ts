import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { AchievementsControllersSchemas } from 'shared/types/controllers'

export const getAllEntriesByDifficulty = forgeController
  .route('GET /:difficulty')
  .description('Get all achievements entries by difficulty')
  .schema(AchievementsControllersSchemas.Entries.getAllEntriesByDifficulty)
  .callback(({ pb, params: { difficulty } }) =>
    pb.collection('achievements__entries').getFullList({
      filter: `difficulty = "${difficulty}"`,
      sort: '-created'
    })
  )

export const createEntry = forgeController
  .route('POST /')
  .description('Create a new achievements entry')
  .schema(AchievementsControllersSchemas.Entries.createEntry)
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.collection('achievements__entries').create(body)
  )

export const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing achievements entry')
  .schema(AchievementsControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'achievements__entries'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.collection('achievements__entries').update(id, body)
  )

export const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete an existing achievements entry')
  .schema(AchievementsControllersSchemas.Entries.deleteEntry)
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
