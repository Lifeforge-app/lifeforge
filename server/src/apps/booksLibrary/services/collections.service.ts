import PocketBase from "pocketbase";
import { BooksLibrarySchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllCollections = (pb: PocketBase) =>
  pb
    .collection("books_library__collections_aggregated")
    .getFullList<WithPB<BooksLibrarySchemas.ICollectionAggregated>>({
      sort: "name",
    });

export const createCollection = async (
  pb: PocketBase,
  data: Omit<BooksLibrarySchemas.ICollection, "amount">,
) => {
  const collection = await pb
    .collection("books_library__collections")
    .create<WithPB<BooksLibrarySchemas.ICollection>>(data);

  return pb
    .collection("books_library__collections_aggregated")
    .getOne<WithPB<BooksLibrarySchemas.ICollectionAggregated>>(collection.id);
};

export const updateCollection = async (
  pb: PocketBase,
  id: string,
  data: Omit<BooksLibrarySchemas.ICollectionAggregated, "amount">,
) => {
  const collection = await pb
    .collection("books_library__collections")
    .update<WithPB<BooksLibrarySchemas.ICollection>>(id, data);

  return pb
    .collection("books_library__collections_aggregated")
    .getOne<WithPB<BooksLibrarySchemas.ICollectionAggregated>>(collection.id);
};

export const deleteCollection = async (pb: PocketBase, id: string) => {
  await pb.collection("books_library__collections").delete(id);
};
