import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllLanguages = forgeController
  .route('GET /')
  .description('Get all languages for the books library')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('books_library__languages_aggregated')
      .getFullList<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguageAggregated>
      >()
  )

const createLanguage = forgeController
  .route('POST /')
  .description('Create a new language for the books library')
  .input({
    body: BooksLibraryCollectionsSchemas.Language
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb
      .collection('books_library__languages')
      .create<ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>>(body)
  )

const updateLanguage = forgeController
  .route('PATCH /:id')
  .description('Update an existing language for the books library')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: BooksLibraryCollectionsSchemas.Language
  })
  .existenceCheck('params', {
    id: 'books_library__languages'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb
      .collection('books_library__languages')
      .update<ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>>(id, body)
  )

const deleteLanguage = forgeController
  .route('DELETE /:id')
  .description('Delete an existing language for the books library')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'books_library__languages'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.collection('books_library__languages').delete(id)
  )

export default forgeRouter({
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage
})
