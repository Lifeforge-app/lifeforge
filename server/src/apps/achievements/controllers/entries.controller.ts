import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { AchievementsControllersSchemas } from 'shared/types/controllers'

const achievementsEntriesRouter = express.Router()

const getAllEntriesByDifficulty = forgeController
  .route('GET /:difficulty')
  .description('Get all achievements entries by difficulty')
  .schema(AchievementsControllersSchemas.Entries.getAllEntriesByDifficulty)
  .callback(({ pb, params: { difficulty } }) =>
    pb.collection('achievements__entries').getFullList({
      filter: `difficulty = "${difficulty}"`,
      sort: '-created'
    })
  )

const createEntry = forgeController
  .route('POST /')
  .description('Create a new achievements entry')
  .schema(AchievementsControllersSchemas.Entries.createEntry)
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.collection('achievements__entries').create(body)
  )

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing achievements entry')
  .schema(AchievementsControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'achievements__entries'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.collection('achievements__entries').update(id, body)
  )

const deleteEntry = forgeController
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

bulkRegisterControllers(achievementsEntriesRouter, [
  getAllEntriesByDifficulty,
  createEntry,
  updateEntry,
  deleteEntry
])

export default achievementsEntriesRouter
