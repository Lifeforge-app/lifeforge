import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import * as CollectionsService from '../services/collections.service'

const booksLibraryCollectionsRouter = express.Router()

const getAllCollections = forgeController
  .route('GET /')
  .description('Get all collections for the books library')
  .schema(BooksLibraryControllersSchemas.Collection.getAllCollections)
  .callback(({ pb }) => CollectionsService.getAllCollections(pb))

const createCollection = forgeController
  .route('POST /')
  .description('Create a new collection for the books library')
  .schema(BooksLibraryControllersSchemas.Collection.createCollection)
  .statusCode(201)
  .callback(({ pb, body }) => CollectionsService.createCollection(pb, body))

const updateCollection = forgeController
  .route('PATCH /:id')
  .description('Update an existing collection for the books library')
  .schema(BooksLibraryControllersSchemas.Collection.updateCollection)
  .existenceCheck('params', {
    id: 'books_library__collections'
  })
  .callback(({ pb, params: { id }, body }) =>
    CollectionsService.updateCollection(pb, id, body)
  )

const deleteCollection = forgeController
  .route('DELETE /:id')
  .description('Delete an existing collection for the books library')
  .schema(BooksLibraryControllersSchemas.Collection.deleteCollection)
  .existenceCheck('params', {
    id: 'books_library__collections'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    CollectionsService.deleteCollection(pb, id)
  )

bulkRegisterControllers(booksLibraryCollectionsRouter, [
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection
])

export default booksLibraryCollectionsRouter
