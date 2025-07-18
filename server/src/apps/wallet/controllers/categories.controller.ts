import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { WalletControllersSchemas } from 'shared/types/controllers'

import * as CategoriesService from '../services/categories.service'

const walletCategoriesRouter = express.Router()

const getAllCategories = forgeController
  .route('GET /')
  .description('Get all wallet categories')
  .schema(WalletControllersSchemas.Categories.getAllCategories)
  .callback(async ({ pb }) => await CategoriesService.getAllCategories(pb))

const createCategory = forgeController
  .route('POST /')
  .description('Create a new wallet category')
  .schema(WalletControllersSchemas.Categories.createCategory)
  .statusCode(201)
  .callback(
    async ({ pb, body }) => await CategoriesService.createCategory(pb, body)
  )

const updateCategory = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet category')
  .schema(WalletControllersSchemas.Categories.updateCategory)
  .existenceCheck('params', {
    id: 'wallet__categories'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await CategoriesService.updateCategory(pb, id, body)
  )

const deleteCategory = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet category')
  .schema(WalletControllersSchemas.Categories.deleteCategory)
  .existenceCheck('params', {
    id: 'wallet__categories'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await CategoriesService.deleteCategory(pb, id)
  )

bulkRegisterControllers(walletCategoriesRouter, [
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
])

export default walletCategoriesRouter
