import PocketBase from "pocketbase";
import { WalletSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCategories = (
  pb: PocketBase,
): Promise<WithPB<WalletSchemas.ICategoryAggregated>[]> =>
  pb
    .collection("wallet__categories_aggregated")
    .getFullList<WithPB<WalletSchemas.ICategoryAggregated>>({
      sort: "name",
    });

export const createCategory = (
  pb: PocketBase,
  data: Omit<WalletSchemas.ICategory, "amount">,
): Promise<WithPB<WalletSchemas.ICategory>> =>
  pb
    .collection("wallet__categories")
    .create<WithPB<WalletSchemas.ICategory>>(data);

export const updateCategory = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletSchemas.ICategory, "amount">,
): Promise<WithPB<WalletSchemas.ICategory>> =>
  pb
    .collection("wallet__categories")
    .update<WithPB<WalletSchemas.ICategory>>(id, data);

export const deleteCategory = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wallet__categories").delete(id);
};
