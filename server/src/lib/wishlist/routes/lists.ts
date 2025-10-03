import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const getById = forgeController
  .query()
  .description('Get wishlist by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__lists'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('wishlist__lists_aggregated').id(id).execute()
  )

const validate = forgeController
  .query()
  .description('Check if wishlist exists')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(
    async ({ pb, query: { id } }) =>
      !!(await pb.getOne
        .collection('wishlist__lists')
        .id(id)
        .execute()
        .catch(() => null))
  )

const list = forgeController
  .query()
  .description('Get all wishlists with statistics')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('wishlist__lists_aggregated').execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new wishlist')
  .input({
    body: SCHEMAS.wishlist.lists.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wishlist__lists').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing wishlist')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wishlist.lists.schema
  })
  .existenceCheck('query', {
    id: 'wishlist__lists'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('wishlist__lists').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a wishlist')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__lists'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wishlist__lists').id(id).execute()
  )

export default forgeRouter({
  getById,
  validate,
  list,
  create,
  update,
  remove
})
