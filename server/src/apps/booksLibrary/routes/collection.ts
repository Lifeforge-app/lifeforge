import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllCollections = forgeController
  .route('GET /')
  .description('Get all collections for the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('books_library__collections_aggregated')
      .sort(['name'])
      .execute()
  )

const createCollection = forgeController
  .route('POST /')
  .description('Create a new collection for the books library')
  .input({
    body: SCHEMAS.books_library.collections
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('books_library__collections').data(body).execute()
  )

const updateCollection = forgeController
  .route('PATCH /:id')
  .description('Update an existing collection for the books library')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.books_library.collections
  })
  .existenceCheck('params', {
    id: 'books_library__collections'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update
      .collection('books_library__collections')
      .id(id)
      .data(body)
      .execute()
  )

const deleteCollection = forgeController
  .route('DELETE /:id')
  .description('Delete an existing collection for the books library')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__collections'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('books_library__collections').id(id).execute()
  )

export default forgeRouter({
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection
})
