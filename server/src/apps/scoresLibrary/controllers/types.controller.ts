import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'
import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

const scoresLibraryTypesRouter = express.Router()

const getTypes = forgeController
  .route('GET /')
  .description('Get all music score types')
  .schema(ScoresLibraryControllersSchemas.Types.getTypes)
  .callback(({ pb }) =>
    pb
      .collection('scores_library__types_aggregated')
      .getFullList<ScoresLibraryCollectionsSchemas.ITypeAggregated>()
  )

const createType = forgeController
  .route('POST /')
  .statusCode(201)
  .description('Create a new music score type')
  .schema(ScoresLibraryControllersSchemas.Types.createType)
  .callback(({ pb, body }) =>
    pb
      .collection('scores_library__types')
      .create<ISchemaWithPB<ScoresLibraryCollectionsSchemas.IType>>(body)
  )

const updateType = forgeController
  .route('PATCH /:id')
  .description('Update an existing music score type')
  .schema(ScoresLibraryControllersSchemas.Types.updateType)
  .callback(({ pb, params, body }) =>
    pb
      .collection('scores_library__types')
      .update<
        ISchemaWithPB<ScoresLibraryCollectionsSchemas.IType>
      >(params.id, body)
  )

const deleteType = forgeController
  .route('DELETE /:id')
  .statusCode(204)
  .description('Delete a music score type')
  .schema(ScoresLibraryControllersSchemas.Types.deleteType)
  .callback(async ({ pb, params }) => {
    await pb.collection('scores_library__types').delete(params.id)
  })

bulkRegisterControllers(scoresLibraryTypesRouter, [
  getTypes,
  createType,
  updateType,
  deleteType
])

export default scoresLibraryTypesRouter
