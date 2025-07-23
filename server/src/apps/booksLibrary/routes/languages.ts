import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllLanguages = forgeController
  .route('GET /')
  .description('Get all languages for the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('books_library__languages_aggregated').execute()
  )

const createLanguage = forgeController
  .route('POST /')
  .description('Create a new language for the books library')
  .input({
    body: SCHEMAS.books_library.languages
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('books_library__languages').data(body).execute()
  )

const updateLanguage = forgeController
  .route('PATCH /:id')
  .description('Update an existing language for the books library')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.books_library.languages
  })
  .existenceCheck('params', {
    id: 'books_library__languages'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('books_library__languages').id(id).data(body).execute()
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
    pb.delete.collection('books_library__languages').id(id).execute()
  )

export default forgeRouter({
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage
})
