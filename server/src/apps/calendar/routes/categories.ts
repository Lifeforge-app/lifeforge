import ClientError from '@functions/ClientError'
import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllCategories = forgeController
  .route('GET /')
  .description('Get all calendar categories')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('calendar__categories_aggregated')
      .getFullList<
        ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
      >({
        sort: '+name'
      })
  )

const getCategoryById = forgeController
  .route('GET /:id')
  .description('Get a calendar category by ID')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__categories'
  })
  .callback(({ pb, params: { id } }) =>
    pb
      .collection('calendar__categories_aggregated')
      .getOne<ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>>(id)
  )

const createCategory = forgeController
  .route('POST /')
  .description('Create a new calendar category')
  .input({
    body: CalendarCollectionsSchemas.Category
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (body.name.startsWith('_')) {
      throw new ClientError('Category name cannot start with _')
    }

    if (
      await pb
        .collection('calendar__categories')
        .getFirstListItem(`name="${body.name}"`)
        .catch(() => null)
    ) {
      throw new ClientError('Category with this name already exists')
    }

    const createdEntry = await pb
      .collection('calendar__categories')
      .create<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>>(body)

    await pb
      .collection('calendar__categories_aggregated')
      .getOne<
        ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
      >(createdEntry.id)
  })

const updateCategory = forgeController
  .route('PATCH /:id')
  .description('Update an existing calendar category')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: CalendarCollectionsSchemas.Category
  })
  .existenceCheck('params', {
    id: 'calendar__categories'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    await pb
      .collection('calendar__categories')
      .update<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>>(id, body)
  })

const deleteCategory = forgeController
  .route('DELETE /:id')
  .description('Delete an existing calendar category')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__categories'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.collection('calendar__categories').delete(id)
  )

export default forgeRouter({
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
})
