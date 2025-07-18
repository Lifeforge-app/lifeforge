import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { uploadMiddleware } from '@middlewares/uploadMiddleware'
import express from 'express'

import { GuitarTabsControllersSchemas } from 'shared/types/controllers'

import * as entriesService from '../services/entries.service'

const guitarTabsEntriesRouter = express.Router()

const getSidebarData = forgeController
  .route('GET /sidebar-data')
  .description('Get sidebar data for guitar tabs')
  .schema(GuitarTabsControllersSchemas.Entries.getSidebarData)
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb))

const getEntries = forgeController
  .route('GET /')
  .description('Get guitar tabs entries')
  .schema(GuitarTabsControllersSchemas.Entries.getEntries)
  .callback(async ({ pb, query }) => await entriesService.getEntries(pb, query))

const getRandomEntry = forgeController
  .route('GET /random')
  .description('Get a random guitar tab entry')
  .schema(GuitarTabsControllersSchemas.Entries.getRandomEntry)
  .callback(async ({ pb }) => await entriesService.getRandomEntry(pb))

const uploadFiles = forgeController
  .route('POST /upload')
  .description('Upload guitar tab files')
  .middlewares(uploadMiddleware)
  .schema(GuitarTabsControllersSchemas.Entries.uploadFiles)
  .statusCode(202)
  .callback(async ({ io, pb, req }) => {
    const files = req.files

    if (!files) {
      throw new ClientError('No files provided')
    }
    return await entriesService.uploadFiles(
      io,
      pb,
      files as Express.Multer.File[]
    )
  })

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update a guitar tab entry')
  .schema(GuitarTabsControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'guitar_tabs__entries'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a guitar tab entry')
  .schema(GuitarTabsControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'guitar_tabs__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id)
  )

const toggleFavorite = forgeController
  .route('POST /favourite/:id')
  .description('Toggle favorite status of a guitar tab entry')
  .schema(GuitarTabsControllersSchemas.Entries.toggleFavorite)
  .existenceCheck('params', {
    id: 'guitar_tabs__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.toggleFavorite(pb, id)
  )

bulkRegisterControllers(guitarTabsEntriesRouter, [
  getSidebarData,
  getEntries,
  getRandomEntry,
  uploadFiles,
  updateEntry,
  deleteEntry,
  toggleFavorite
])

export default guitarTabsEntriesRouter
