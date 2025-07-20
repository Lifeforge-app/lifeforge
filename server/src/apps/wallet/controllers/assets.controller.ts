import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { WalletControllersSchemas } from 'shared/types/controllers'

import * as AssetsService from '../services/assets.service'

const walletAssetsRouter = express.Router()

const getAllAssets = forgeController
  .route('GET /')
  .description('Get all wallet assets')
  .schema(WalletControllersSchemas.Assets.getAllAssets)
  .callback(async ({ pb }) => await AssetsService.getAllAssets(pb))

const createAsset = forgeController
  .route('POST /')
  .description('Create a new wallet asset')
  .schema(WalletControllersSchemas.Assets.createAsset)
  .statusCode(201)
  .callback(async ({ pb, body }) => await AssetsService.createAsset(pb, body))

const updateAsset = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet asset')
  .schema(WalletControllersSchemas.Assets.updateAsset)
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
  .schema(WalletControllersSchemas.Assets.deleteAsset)
  .existenceCheck('params', {
    id: 'wallet__assets'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await AssetsService.deleteAsset(pb, id)
  )

bulkRegisterControllers(walletAssetsRouter, [
  getAllAssets,
  createAsset,
  updateAsset,
  deleteAsset
])

export default walletAssetsRouter
