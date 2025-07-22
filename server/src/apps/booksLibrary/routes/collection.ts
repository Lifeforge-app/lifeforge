import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllCollections = forgeController
  .route('GET /')
  .description('Get all collections for the books library')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('books_library__collections_aggregated')
      .getFullList<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>
      >({
        sort: 'name'
      })
  )

const createCollection = forgeController
  .route('POST /')
  .description('Create a new collection for the books library')
  .input({
    body: BooksLibraryCollectionsSchemas.Collection
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const collection = await pb
      .collection('books_library__collections')
      .create<ISchemaWithPB<BooksLibraryCollectionsSchemas.ICollection>>(body)

    return pb
      .collection('books_library__collections_aggregated')
      .getOne<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>
      >(collection.id)
  })

const updateCollection = forgeController
  .route('PATCH /:id')
  .description('Update an existing collection for the books library')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: BooksLibraryCollectionsSchemas.Collection
  })
  .existenceCheck('params', {
    id: 'books_library__collections'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    const collection = await pb
      .collection('books_library__collections')
      .update<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.ICollection>
      >(id, body)

    return pb
      .collection('books_library__collections_aggregated')
      .getOne<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>
      >(collection.id)
  })

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
    pb.collection('books_library__collections').delete(id)
  )

export default forgeRouter({
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection
})
