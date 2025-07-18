import PocketBase from "pocketbase";
import { CalendarSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCategories = (
  pb: PocketBase,
): Promise<WithPB<CalendarSchemas.ICategory>[]> =>
  pb
    .collection("calendar__categories_aggregated")
    .getFullList<WithPB<CalendarSchemas.ICategory>>({
      sort: "+name",
    });

export const createCategory = async (
  pb: PocketBase,
  categoryData: Omit<CalendarSchemas.ICategory, "amount">,
): Promise<WithPB<CalendarSchemas.ICategory>> => {
  const createdEntry = await pb
    .collection("calendar__categories")
    .create<WithPB<Omit<CalendarSchemas.ICategory, "amount">>>(categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<CalendarSchemas.ICategory>>(createdEntry.id);
};

export const updateCategory = async (
  pb: PocketBase,
  id: string,
  categoryData: Omit<CalendarSchemas.ICategory, "amount">,
): Promise<WithPB<CalendarSchemas.ICategory>> => {
  const updatedEntry = await pb
    .collection("calendar__categories")
    .update<
      WithPB<Omit<CalendarSchemas.ICategory, "amount">>
    >(id, categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<CalendarSchemas.ICategory>>(updatedEntry.id);
};

export const deleteCategory = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__categories").delete(id);
};

export const getCategoryById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<CalendarSchemas.ICategory>> =>
  pb
    .collection("calendar__categories")
    .getOne<WithPB<CalendarSchemas.ICategory>>(id);
