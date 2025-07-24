import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllCategories = forgeController.query
  .description('Get all calendar categories')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('calendar__categories_aggregated')
      .sort(['name'])
      .execute()
  )

const getCategoryById = forgeController.query
  .description('Get a calendar category by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('calendar__categories_aggregated').id(id).execute()
  )

const createCategory = forgeController.mutation
  .description('Create a new calendar category')
  .input({
    body: SCHEMAS.calendar.categories
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (body.name.startsWith('_')) {
      throw new ClientError('Category name cannot start with _')
    }

    return await pb.create
      .collection('calendar__categories')
      .data(body)
      .execute()
  })

const updateCategory = forgeController.mutation
  .description('Update an existing calendar category')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.categories
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    if (body.name.startsWith('_')) {
      throw new ClientError('Category name cannot start with _')
    }

    await pb.update
      .collection('calendar__categories')
      .id(id)
      .data(body)
      .execute()
  })

const deleteCategory = forgeController.mutation
  .description('Delete an existing calendar category')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('calendar__categories').id(id).execute()
  )

export default forgeRouter({
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
})
