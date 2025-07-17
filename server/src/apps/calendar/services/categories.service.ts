import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { ICalendarCategory } from "../schema";

export const getAllCategories = (
  pb: PocketBase,
): Promise<WithPB<ICalendarCategory>[]> =>
  pb
    .collection("calendar__categories_aggregated")
    .getFullList<WithPB<ICalendarCategory>>({
      sort: "+name",
    });

export const createCategory = async (
  pb: PocketBase,
  categoryData: Omit<ICalendarCategory, "amount">,
): Promise<WithPB<ICalendarCategory>> => {
  const createdEntry = await pb
    .collection("calendar__categories")
    .create<WithPB<Omit<ICalendarCategory, "amount">>>(categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<ICalendarCategory>>(createdEntry.id);
};

export const updateCategory = async (
  pb: PocketBase,
  id: string,
  categoryData: Omit<ICalendarCategory, "amount">,
): Promise<WithPB<ICalendarCategory>> => {
  const updatedEntry = await pb
    .collection("calendar__categories")
    .update<WithPB<Omit<ICalendarCategory, "amount">>>(id, categoryData);

  return await pb
    .collection("calendar__categories_aggregated")
    .getOne<WithPB<ICalendarCategory>>(updatedEntry.id);
};

export const deleteCategory = async (pb: PocketBase, id: string) => {
  await pb.collection("calendar__categories").delete(id);
};

export const getCategoryById = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<ICalendarCategory>> =>
  pb.collection("calendar__categories").getOne<WithPB<ICalendarCategory>>(id);
