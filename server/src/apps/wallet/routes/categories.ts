import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllCategories = forgeController.query
  .description('Get all wallet categories')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__categories_aggregated')
      .sort(['name'])
      .execute()
  )

const createCategory = forgeController.mutation
  .description('Create a new wallet category')
  .input({
    body: SCHEMAS.wallet.categories
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wallet__categories').data(body).execute()
  )

const updateCategory = forgeController.mutation
  .description('Update an existing wallet category')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wallet.categories
  })
  .existenceCheck('query', {
    id: 'wallet__categories'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('wallet__categories').id(id).data(body).execute()
  )

const deleteCategory = forgeController.mutation
  .description('Delete a wallet category')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__categories'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wallet__categories').id(id).execute()
  )

export default forgeRouter({
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
})
