import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'
const getTypes = forgeController
  .route('GET /')
  .description('Get all music score types')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('scores_library__types_aggregated')
      .getFullList<
        ISchemaWithPB<ScoresLibraryCollectionsSchemas.ITypeAggregated>
      >({
        sort: 'name'
      })
  )

const createType = forgeController
  .route('POST /')
  .description('Create a new music score type')
  .input({})
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb
      .collection('scores_library__types')
      .create<ISchemaWithPB<ScoresLibraryCollectionsSchemas.IType>>(body)
  )

const updateType = forgeController
  .route('PATCH /:id')
  .description('Update an existing music score type')
  .input({})
  .callback(({ pb, params, body }) =>
    pb
      .collection('scores_library__types')
      .update<
        ISchemaWithPB<ScoresLibraryCollectionsSchemas.IType>
      >(params.id, body)
  )

const deleteType = forgeController
  .route('DELETE /:id')
  .description('Delete a music score type')
  .input({})
  .statusCode(204)
  .callback(async ({ pb, params }) => {
    await pb.collection('scores_library__types').delete(params.id)
  })

export default forgeRouter({
  getTypes,
  createType,
  updateType,
  deleteType
})
