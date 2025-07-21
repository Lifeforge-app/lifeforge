import ClientError from '@functions/ClientError'
import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { uploadMiddleware } from '@middlewares/uploadMiddleware'

import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

import * as entriesService from '../services/entries.service'

const getSidebarData = forgeController
  .route('GET /sidebar-data')
  .description('Get sidebar data for scores library')
  .schema(ScoresLibraryControllersSchemas.Entries.getSidebarData)
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb))

const getEntries = forgeController
  .route('GET /')
  .description('Get scores library entries')
  .schema(ScoresLibraryControllersSchemas.Entries.getEntries)
  .callback(async ({ pb, query }) => await entriesService.getEntries(pb, query))

const getRandomEntry = forgeController
  .route('GET /random')
  .description('Get a random score entry')
  .schema(ScoresLibraryControllersSchemas.Entries.getRandomEntry)
  .callback(async ({ pb }) => await entriesService.getRandomEntry(pb))

const uploadFiles = forgeController
  .route('POST /upload')
  .description('Upload score files')
  .schema(ScoresLibraryControllersSchemas.Entries.uploadFiles)
  .middlewares(uploadMiddleware)
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
  .description('Update a score entry')
  .schema(ScoresLibraryControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'scores_library__entries'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a score entry')
  .schema(ScoresLibraryControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'scores_library__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id)
  )

const toggleFavourite = forgeController
  .route('POST /favourite/:id')
  .description('Toggle favourite status of a score entry')
  .schema(ScoresLibraryControllersSchemas.Entries.toggleFavourite)
  .existenceCheck('params', {
    id: 'scores_library__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.toggleFavourite(pb, id)
  )

export default forgeRouter({
  getSidebarData,
  getEntries,
  getRandomEntry,
  uploadFiles,
  updateEntry,
  deleteEntry,
  toggleFavourite
})
