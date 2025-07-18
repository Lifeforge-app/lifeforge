import PocketBase from "pocketbase";
import { WishlistCollectionsSchemas } from "shared/types/collections";

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
): Promise<WithPB<WishlistCollectionsSchemas.IListAggregated>> =>
  pb
    .collection("wishlist__lists_aggregated")
    .getOne<WithPB<WishlistCollectionsSchemas.IListAggregated>>(id);

export const getAllLists = (
  pb: PocketBase,
): Promise<WithPB<WishlistCollectionsSchemas.IListAggregated>[]> =>
  pb
    .collection("wishlist__lists_aggregated")
    .getFullList<WithPB<WishlistCollectionsSchemas.IListAggregated>>({
      sort: "name",
    });

export const createList = (
  pb: PocketBase,
  data: WishlistCollectionsSchemas.IList,
): Promise<WithPB<WishlistCollectionsSchemas.IList>> =>
  pb
    .collection("wishlist__lists")
    .create<WithPB<WishlistCollectionsSchemas.IList>>(data);

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: WishlistCollectionsSchemas.IList,
): Promise<WithPB<WishlistCollectionsSchemas.IList>> =>
  pb
    .collection("wishlist__lists")
    .update<WithPB<WishlistCollectionsSchemas.IList>>(id, data);

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("wishlist__lists").delete(id);
};
