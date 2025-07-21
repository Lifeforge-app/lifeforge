import ClientError from '@functions/ClientError'
import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { uploadMiddleware } from '@middlewares/uploadMiddleware'

import { MomentVaultControllersSchemas } from 'shared/types/controllers'

import * as EntriesServices from '../services/entries.service'

const getEntries = forgeController
  .route('GET /')
  .description('Get all moment vault entries')
  .schema(MomentVaultControllersSchemas.Entries.getEntries)
  .callback(
    async ({ pb, query }) => await EntriesServices.getAllEntries(pb, query.page)
  )

const createEntry = forgeController
  .route('POST /')
  .description('Create a new moment vault entry')
  .schema(MomentVaultControllersSchemas.Entries.createEntry)
  .middlewares(uploadMiddleware)
  .callback(async ({ pb, body: { type, content, transcription }, req }) => {
    if (type === 'audio') {
      const { files } = req as {
        files: Express.Multer.File[]
      }

      if (!files?.length) {
        throw new ClientError('No file uploaded')
      }

      if (files.length > 1) {
        throw new ClientError('Only one audio file is allowed')
      }

      if (!files[0].mimetype.startsWith('audio/')) {
        throw new ClientError('File must be an audio file')
      }

      return await EntriesServices.createAudioEntry(pb, {
        file: files[0],
        transcription
      })
    }

    if (type === 'text') {
      if (!content) {
        throw new ClientError('Content is required for text entries')
      }

      return await EntriesServices.createTextEntry(pb, content)
    }

    if (type === 'photos') {
      const { files } = req as {
        files: Express.Multer.File[]
      }

      if (!files?.length) {
        throw new ClientError('No files uploaded')
      }

      return await EntriesServices.createPhotosEntry(pb, files)
    }
    throw new ClientError('Invalid entry type')
  })
  .statusCode(201)

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update a moment vault entry')
  .schema(MomentVaultControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'moment_vault__entries'
  })
  .callback(
    async ({ pb, params: { id }, body: { content } }) =>
      await EntriesServices.updateEntry(pb, id, content)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a moment vault entry')
  .schema(MomentVaultControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'moment_vault__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await EntriesServices.deleteEntry(pb, id)
  )
  .statusCode(204)

export default forgeRouter({
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry
})
