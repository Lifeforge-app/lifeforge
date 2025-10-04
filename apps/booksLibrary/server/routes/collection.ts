import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description(
    'Get all collections for the books library. If the user ask to list a book in specific collection, call this tool first to get the collection ID.'
  )
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('books_library__collections_aggregated')
      .sort(['name'])
      .execute()
  )
  .enableAIToolCall()

const create = forgeController
  .mutation()
  .description('Create a new collection for the books library')
  .input({
    body: SCHEMAS.books_library.collections.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('books_library__collections').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing collection for the books library')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.books_library.collections.schema
  })
  .existenceCheck('query', {
    id: 'books_library__collections'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update
      .collection('books_library__collections')
      .id(id)
      .data(body)
      .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete an existing collection for the books library')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'books_library__collections'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('books_library__collections').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
