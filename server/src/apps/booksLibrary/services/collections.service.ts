import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IBooksLibraryCollection } from "../schema";

export const getAllCollections = (
  pb: PocketBase,
): Promise<WithPB<IBooksLibraryCollection>[]> =>
  pb
    .collection("books_library__collections_aggregated")
    .getFullList<WithPB<IBooksLibraryCollection>>({
      sort: "name",
    });

export const createCollection = (
  pb: PocketBase,
  data: Omit<IBooksLibraryCollection, "amount">,
): Promise<WithPB<IBooksLibraryCollection>> =>
  pb
    .collection("books_library__collections")
    .create<WithPB<IBooksLibraryCollection>>(data);

export const updateCollection = (
  pb: PocketBase,
  id: string,
  data: Omit<IBooksLibraryCollection, "amount">,
): Promise<WithPB<IBooksLibraryCollection>> =>
  pb
    .collection("books_library__collections")
    .update<WithPB<IBooksLibraryCollection>>(id, data);

export const deleteCollection = async (pb: PocketBase, id: string) => {
  await pb.collection("books_library__collections").delete(id);
};
