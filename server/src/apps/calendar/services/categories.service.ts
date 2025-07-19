import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { CalendarCollectionsSchemas } from 'shared/types/collections'

export const getAllCategories = (
  pb: PocketBase
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>[]> =>
  pb
    .collection('calendar__categories_aggregated')
    .getFullList<
      ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
    >({
      sort: '+name'
    })

export const createCategory = async (
  pb: PocketBase,
  categoryData: Omit<CalendarCollectionsSchemas.ICategory, 'amount'>
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>> => {
  const createdEntry = await pb
    .collection('calendar__categories')
    .create<
      ISchemaWithPB<Omit<CalendarCollectionsSchemas.ICategory, 'amount'>>
    >(categoryData)

  return await pb
    .collection('calendar__categories_aggregated')
    .getOne<
      ISchemaWithPB<CalendarCollectionsSchemas.ICategory>
    >(createdEntry.id)
}

export const updateCategory = async (
  pb: PocketBase,
  id: string,
  categoryData: Omit<CalendarCollectionsSchemas.ICategory, 'amount'>
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>> => {
  const updatedEntry = await pb
    .collection('calendar__categories')
    .update<
      ISchemaWithPB<Omit<CalendarCollectionsSchemas.ICategory, 'amount'>>
    >(id, categoryData)

  return await pb
    .collection('calendar__categories_aggregated')
    .getOne<
      ISchemaWithPB<CalendarCollectionsSchemas.ICategory>
    >(updatedEntry.id)
}

export const deleteCategory = async (pb: PocketBase, id: string) => {
  await pb.collection('calendar__categories').delete(id)
}

export const getCategoryById = (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>> =>
  pb
    .collection('calendar__categories_aggregated')
    .getOne<ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>>(id)
