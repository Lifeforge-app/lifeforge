import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod'

const list = forgeController
  .query()
  .description('Get all music score collections')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('scores_library__collections_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new music score collection')
  .input({
    body: SCHEMAS.scores_library.collections.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('scores_library__collections').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing music score collection')
  .input({
    query: z.object({ id: z.string() }),
    body: SCHEMAS.scores_library.collections.schema
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update
      .collection('scores_library__collections')
      .id(id)
      .data(body)
      .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a music score collection')
  .input({
    query: z.object({ id: z.string() })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('scores_library__collections').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
