import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as CategoriesService from '../services/categories.service'

const getAllCategories = forgeController
  .route('GET /')
  .description('Get all wallet categories')
  .input({})
  .callback(async ({ pb }) => await CategoriesService.getAllCategories(pb))

const createCategory = forgeController
  .route('POST /')
  .description('Create a new wallet category')
  .input({})
  .statusCode(201)
  .callback(
    async ({ pb, body }) => await CategoriesService.createCategory(pb, body)
  )

const updateCategory = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet category')
  .input({})
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
  .input({})
  .existenceCheck('params', {
    id: 'wallet__categories'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await CategoriesService.deleteCategory(pb, id)
  )

export default forgeRouter({
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
})
