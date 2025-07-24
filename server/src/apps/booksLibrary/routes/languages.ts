import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllLanguages = forgeController.query
  .description('Get all languages for the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('books_library__languages_aggregated').execute()
  )

const createLanguage = forgeController.mutation
  .description('Create a new language for the books library')
  .input({
    body: SCHEMAS.books_library.languages
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('books_library__languages').data(body).execute()
  )

const updateLanguage = forgeController.mutation
  .description('Update an existing language for the books library')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.books_library.languages
  })
  .existenceCheck('query', {
    id: 'books_library__languages'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('books_library__languages').id(id).data(body).execute()
  )

const deleteLanguage = forgeController.mutation
  .description('Delete an existing language for the books library')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__languages'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('books_library__languages').id(id).execute()
  )

export default forgeRouter({
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage
})
