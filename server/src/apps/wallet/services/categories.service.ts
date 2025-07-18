import PocketBase from "pocketbase";
import { WalletCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCategories = (
  pb: PocketBase,
): Promise<WithPB<WalletCollectionsSchemas.ICategoryAggregated>[]> =>
  pb
    .collection("wallet__categories_aggregated")
    .getFullList<WithPB<WalletCollectionsSchemas.ICategoryAggregated>>({
      sort: "name",
    });

export const createCategory = (
  pb: PocketBase,
  data: Omit<WalletCollectionsSchemas.ICategory, "amount">,
): Promise<WithPB<WalletCollectionsSchemas.ICategory>> =>
  pb
    .collection("wallet__categories")
    .create<WithPB<WalletCollectionsSchemas.ICategory>>(data);

export const updateCategory = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletCollectionsSchemas.ICategory, "amount">,
): Promise<WithPB<WalletCollectionsSchemas.ICategory>> =>
  pb
    .collection("wallet__categories")
    .update<WithPB<WalletCollectionsSchemas.ICategory>>(id, data);

export const deleteCategory = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wallet__categories").delete(id);
};
