import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as AssetsService from '../services/assets.service'

const getAllAssets = forgeController
  .route('GET /')
  .description('Get all wallet assets')
  .input({})
  .callback(async ({ pb }) => await AssetsService.getAllAssets(pb))

const createAsset = forgeController
  .route('POST /')
  .description('Create a new wallet asset')
  .input({})
  .statusCode(201)
  .callback(async ({ pb, body }) => await AssetsService.createAsset(pb, body))

const getAssetAccumulatedBalance = forgeController
  .route('GET /balance/:id')
  .description('Get accumulated balance for a wallet asset')
  .input({})
  .existenceCheck('params', {
    id: 'wallet__assets'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await AssetsService.getAssetAccumulatedBalance(pb, id)
  )

const updateAsset = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet asset')
  .input({})
  .existenceCheck('params', {
    id: 'wallet__assets'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await AssetsService.updateAsset(pb, id, body)
  )

const deleteAsset = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet asset')
  .input({})
  .existenceCheck('params', {
    id: 'wallet__assets'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await AssetsService.deleteAsset(pb, id)
  )

export default forgeRouter({
  getAllAssets,
  getAssetAccumulatedBalance,
  createAsset,
  updateAsset,
  deleteAsset
})
