import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { MusicControllersSchemas } from 'shared/types/controllers'

import * as EntriesService from '../services/entries.service'

const musicEntriesRouter = express.Router()

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all music entries')
  .schema(MusicControllersSchemas.Entries.getAllEntries)
  .callback(async ({ pb }) => await EntriesService.getAllEntries(pb))

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update a music entry')
  .schema(MusicControllersSchemas.Entries.updateEntry)
  .callback(
    async ({ pb, params: { id }, body }) =>
      await EntriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a music entry')
  .schema(MusicControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'music__entries'
  })
  .callback(async ({ pb, params: { id } }) =>
    EntriesService.deleteEntry(pb, id)
  )
  .statusCode(204)

const toggleFavorite = forgeController
  .route('POST /favourite/:id')
  .description('Toggle favorite status of a music entry')
  .schema(MusicControllersSchemas.Entries.toggleFavorite)
  .existenceCheck('params', {
    id: 'music__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await EntriesService.toggleFavorite(pb, id)
  )

bulkRegisterControllers(musicEntriesRouter, [
  getAllEntries,
  updateEntry,
  deleteEntry,
  toggleFavorite
])

export default musicEntriesRouter
