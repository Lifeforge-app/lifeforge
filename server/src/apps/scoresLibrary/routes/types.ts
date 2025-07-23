import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getTypes = forgeController
  .route('GET /')
  .description('Get all music score types')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('scores_library__types_aggregated')
      .sort(['name'])
      .execute()
  )

const createType = forgeController
  .route('POST /')
  .description('Create a new music score type')
  .input({
    body: SCHEMAS.scores_library.types
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('scores_library__types').data(body).execute()
  )

const updateType = forgeController
  .route('PATCH /:id')
  .description('Update an existing music score type')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.scores_library.types
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('scores_library__types').id(id).data(body).execute()
  )

const deleteType = forgeController
  .route('DELETE /:id')
  .description('Delete a music score type')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('scores_library__types').id(id).execute()
  )

export default forgeRouter({
  getTypes,
  createType,
  updateType,
  deleteType
})
