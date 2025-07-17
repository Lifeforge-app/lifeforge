import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import scrapeProviders from "../helpers/scrapers/index";
import { IWishlistEntry } from "../schema";

export const getCollectionId = (pb: PocketBase): string =>
  pb.collection("wishlist__entries").collectionIdOrName;

export const getEntriesByListId = (
  pb: PocketBase,
  listId: string,
  bought?: boolean,
): Promise<WithPB<IWishlistEntry>[]> =>
  pb.collection("wishlist__entries").getFullList<WithPB<IWishlistEntry>>({
    filter: `list = "${listId}" ${
      typeof bought !== "undefined" ? `&& bought = ${bought}` : ""
    }`,
  });

export const scrapeExternal = async (
  pb: PocketBase,
  provider: string,
  url: string,
): Promise<{
  name: string;
  price: number;
  image?: string;
}> => {
  const result = await scrapeProviders[
    provider as keyof typeof scrapeProviders
  ]?.(pb, url);

  if (!result) {
    throw new Error("Error scraping provider");
  }

  return result;
};

export const createEntry = async (
  pb: PocketBase,
  data: Omit<IWishlistEntry, "image" | "bought_at"> & { image?: File },
): Promise<WithPB<IWishlistEntry>> => {
  const entry = await pb
    .collection("wishlist__entries")
    .create<WithPB<IWishlistEntry>>(data);

  return entry;
};

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  data: {
    list: string;
    name: string;
    url: string;
    price: number;
    image?: File | null;
  },
): Promise<WithPB<IWishlistEntry>> => {
  const entry = await pb
    .collection("wishlist__entries")
    .update<WithPB<IWishlistEntry>>(id, data);

  return entry;
};

export const getEntry = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IWishlistEntry>> => {
  return await pb
    .collection("wishlist__entries")
    .getOne<WithPB<IWishlistEntry>>(id);
};

export const updateEntryBoughtStatus = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IWishlistEntry>> => {
  const oldEntry = await pb
    .collection("wishlist__entries")
    .getOne<WithPB<IWishlistEntry>>(id);

  const entry = await pb
    .collection("wishlist__entries")
    .update<WithPB<IWishlistEntry>>(id, {
      bought: !oldEntry.bought,
      bought_at: oldEntry.bought ? null : new Date().toISOString(),
    });

  return entry;
};

export const deleteEntry = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wishlist__entries").delete(id);
};
