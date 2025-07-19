import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { getAPIKey } from '@functions/getAPIKey'
import express from 'express'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import * as EntriesService from '../services/entries.service'

const booksLibraryEntriesRouter = express.Router()

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all entries in the books library')
  .schema(BooksLibraryControllersSchemas.Entries.getAllEntries)
  .callback(({ pb }) => EntriesService.getAllEntries(pb))

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing entry in the books library')
  .schema(BooksLibraryControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .existenceCheck('body', {
    category: '[books_library__categories]',
    languages: '[books_library__languages]'
  })
  .callback(({ pb, params: { id }, body }) =>
    EntriesService.updateEntry(pb, id, body)
  )

const toggleFavouriteStatus = forgeController
  .route('POST /favourite/:id')
  .description('Toggle the favourite status of an entry in the books library')
  .schema(BooksLibraryControllersSchemas.Entries.toggleFavouriteStatus)
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(({ pb, params: { id } }) =>
    EntriesService.toggleFavouriteStatus(pb, id)
  )

const toggleReadStatus = forgeController
  .route('POST /read/:id')
  .description('Toggle the read status of an entry in the books library')
  .schema(BooksLibraryControllersSchemas.Entries.toggleReadStatus)
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, params: { id } }) =>
    EntriesService.toggleReadStatus(pb, id)
  )

const sendToKindle = forgeController
  .route('POST /send-to-kindle/:id')
  .description('Send an entry to a Kindle email address')
  .schema(BooksLibraryControllersSchemas.Entries.sendToKindle)
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .callback(async ({ pb, params: { id }, body: { target } }) => {
    const smtpUser = await getAPIKey('smtp-user', pb)

    const smtpPassword = await getAPIKey('smtp-pass', pb)

    if (!smtpUser || !smtpPassword) {
      throw new ClientError(
        'SMTP user or password not found. Please set them in the API Keys module.'
      )
    }

    return EntriesService.sendToKindle(
      pb,
      id,
      {
        user: smtpUser,
        pass: smtpPassword
      },
      target
    )
  })

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete an existing entry in the books library')
  .schema(BooksLibraryControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'books_library__entries'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => EntriesService.deleteEntry(pb, id))

bulkRegisterControllers(booksLibraryEntriesRouter, [
  getAllEntries,
  updateEntry,
  toggleFavouriteStatus,
  toggleReadStatus,
  sendToKindle,
  deleteEntry
])

export default booksLibraryEntriesRouter
