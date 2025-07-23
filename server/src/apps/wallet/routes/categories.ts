import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllCategories = forgeController
  .route('GET /')
  .description('Get all wallet categories')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__categories_aggregated')
      .sort(['name'])
      .execute()
  )

const createCategory = forgeController
  .route('POST /')
  .description('Create a new wallet category')
  .input({
    body: SCHEMAS.wallet.categories
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wallet__categories').data(body).execute()
  )

const updateCategory = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet category')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wallet.categories
  })
  .existenceCheck('params', {
    id: 'wallet__categories'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('wallet__categories').id(id).data(body).execute()
  )

const deleteCategory = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet category')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wallet__categories'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('wallet__categories').id(id).execute()
  )

export default forgeRouter({
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
})
