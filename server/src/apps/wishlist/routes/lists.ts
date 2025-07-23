import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

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
  .callback(({ pb, params: { id } }) =>
    pb.getOne.collection('wishlist__lists').id(id).execute()
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
    async ({ pb, params: { id } }) =>
      !!(await pb.getOne
        .collection('wishlist__lists')
        .id(id)
        .execute()
        .catch(() => null))
  )

const getAllLists = forgeController
  .route('GET /')
  .description('Get all wishlists with statistics')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('wishlist__lists').execute())

const createList = forgeController
  .route('POST /')
  .description('Create a new wishlist')
  .input({
    body: SCHEMAS.wishlist.lists
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wishlist__lists_aggregated').data(body).execute()
  )

const updateList = forgeController
  .route('PATCH /:id')
  .description('Update an existing wishlist')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wishlist.lists
  })
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update
      .collection('wishlist__lists_aggregated')
      .id(id)
      .data(body)
      .execute()
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
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('wishlist__lists_aggregated').id(id).execute()
  )

export default forgeRouter({
  getList,
  checkListExists,
  getAllLists,
  createList,
  updateList,
  deleteList
})
