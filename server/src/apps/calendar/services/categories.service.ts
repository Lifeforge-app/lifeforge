import PocketBase from "pocketbase";
import { CalendarCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCategories = (
  pb: PocketBase,
): Promise<WithPB<CalendarCollectionsSchemas.ICategory>[]> =>
  pb
    .collection("calendar__categories_aggregated")
    .getFullList<WithPB<CalendarCollectionsSchemas.ICategory>>({
      sort: "+name",
    });

export const createCategory = async (
  pb: PocketBase,
  categoryData: Omit<CalendarCollectionsSchemas.ICategory, "amount">,
): Promise<WithPB<CalendarCollectionsSchemas.ICategory>> => {
  const createdEntry = await pb
    .collection("calendar__categories")
    .create<
      WithPB<Omit<CalendarCollectionsSchemas.ICategory, "amount">>
    >(categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<CalendarCollectionsSchemas.ICategory>>(createdEntry.id);
};

export const updateCategory = async (
  pb: PocketBase,
  id: string,
  categoryData: Omit<CalendarCollectionsSchemas.ICategory, "amount">,
): Promise<WithPB<CalendarCollectionsSchemas.ICategory>> => {
  const updatedEntry = await pb
    .collection("calendar__categories")
    .update<
      WithPB<Omit<CalendarCollectionsSchemas.ICategory, "amount">>
    >(id, categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<CalendarCollectionsSchemas.ICategory>>(updatedEntry.id);
};

export const deleteCategory = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__categories").delete(id);
};

export const getCategoryById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<CalendarCollectionsSchemas.ICategory>> =>
  pb
    .collection("calendar__categories")
    .getOne<WithPB<CalendarCollectionsSchemas.ICategory>>(id);
