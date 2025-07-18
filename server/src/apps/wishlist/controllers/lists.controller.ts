import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { WishlistControllersSchemas } from 'shared/types/controllers'

import * as listsService from '../services/lists.service'

const wishlistListsRouter = express.Router()

const getList = forgeController
  .route('GET /:id')
  .description('Get wishlist by ID')
  .schema(WishlistControllersSchemas.Lists.getList)
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(
    async ({ pb, params: { id } }) => await listsService.getList(pb, id)
  )

const checkListExists = forgeController
  .route('GET /valid/:id')
  .description('Check if wishlist exists')
  .schema(WishlistControllersSchemas.Lists.checkListExists)
  .callback(
    async ({ pb, params: { id } }) => await listsService.checkListExists(pb, id)
  )

const getAllLists = forgeController
  .route('GET /')
  .description('Get all wishlists with statistics')
  .schema(WishlistControllersSchemas.Lists.getAllLists)
  .callback(async ({ pb }) => await listsService.getAllLists(pb))

const createList = forgeController
  .route('POST /')
  .description('Create a new wishlist')
  .schema(WishlistControllersSchemas.Lists.createList)
  .statusCode(201)
  .callback(async ({ pb, body }) => await listsService.createList(pb, body))

const updateList = forgeController
  .route('PATCH /:id')
  .description('Update an existing wishlist')
  .schema(WishlistControllersSchemas.Lists.updateList)
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await listsService.updateList(pb, id, body)
  )

const deleteList = forgeController
  .route('DELETE /:id')
  .description('Delete a wishlist')
  .schema(WishlistControllersSchemas.Lists.deleteList)
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await listsService.deleteList(pb, id)
  )

bulkRegisterControllers(wishlistListsRouter, [
  getList,
  checkListExists,
  getAllLists,
  createList,
  updateList,
  deleteList
])

export default wishlistListsRouter
