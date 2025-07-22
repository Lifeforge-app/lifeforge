import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import { WishlistCollectionsSchemas } from 'shared/types/collections'

import * as listsService from '../services/lists.service'

const getList = forgeController
  .route('GET /:id')
  .description('Get wishlist by ID')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(
    async ({ pb, params: { id } }) => await listsService.getList(pb, id)
  )

const checkListExists = forgeController
  .route('GET /valid/:id')
  .description('Check if wishlist exists')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .callback(
    async ({ pb, params: { id } }) => await listsService.checkListExists(pb, id)
  )

const getAllLists = forgeController
  .route('GET /')
  .description('Get all wishlists with statistics')
  .input({})
  .callback(async ({ pb }) => await listsService.getAllLists(pb))

const createList = forgeController
  .route('POST /')
  .description('Create a new wishlist')
  .input({
    body: WishlistCollectionsSchemas.List
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => await listsService.createList(pb, body))

const updateList = forgeController
  .route('PATCH /:id')
  .description('Update an existing wishlist')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: WishlistCollectionsSchemas.List
  })
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
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await listsService.deleteList(pb, id)
  )

export default forgeRouter({
  getList,
  checkListExists,
  getAllLists,
  createList,
  updateList,
  deleteList
})
