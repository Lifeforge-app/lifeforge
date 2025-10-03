import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description('Get all music score types')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('scores_library__types_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new music score type')
  .input({
    body: SCHEMAS.scores_library.types.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('scores_library__types').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing music score type')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.scores_library.types.schema
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('scores_library__types').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a music score type')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('scores_library__types').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
