import PocketBase from "pocketbase";
import { WishlistSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const checkListExists = async (
  pb: PocketBase,
  id: string,
): Promise<boolean> => {
  try {
    await pb.collection("wishlist__lists").getOne(id);
    return true;
  } catch (error) {
    return false;
  }
};

export const getList = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<WishlistSchemas.IListAggregated>> =>
  pb
    .collection("wishlist__lists_aggregated")
    .getOne<WithPB<WishlistSchemas.IListAggregated>>(id);

export const getAllLists = (
  pb: PocketBase,
): Promise<WithPB<WishlistSchemas.IListAggregated>[]> =>
  pb
    .collection("wishlist__lists_aggregated")
    .getFullList<WithPB<WishlistSchemas.IListAggregated>>({
      sort: "name",
    });

export const createList = (
  pb: PocketBase,
  data: WishlistSchemas.IList,
): Promise<WithPB<WishlistSchemas.IList>> =>
  pb.collection("wishlist__lists").create<WithPB<WishlistSchemas.IList>>(data);

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: WishlistSchemas.IList,
): Promise<WithPB<WishlistSchemas.IList>> =>
  pb
    .collection("wishlist__lists")
    .update<WithPB<WishlistSchemas.IList>>(id, data);

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("wishlist__lists").delete(id);
};
