import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IVirtualWardrobeEntry, IVirtualWardrobeSidebarData } from "../schema";

export const getSidebarData = async (
  pb: PocketBase,
): Promise<IVirtualWardrobeSidebarData> => {
  const allEntries = await pb
    .collection("virtual_wardrobe__entries")
    .getFullList<IVirtualWardrobeEntry>();

  const categories = allEntries.reduce(
    (acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const subcategories = allEntries.reduce(
    (acc, curr) => {
      if (!acc[curr.subcategory]) {
        acc[curr.subcategory] = 0;
      }
      acc[curr.subcategory]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const brands = allEntries.reduce(
    (acc, curr) => {
      if (!acc[curr.brand]) {
        acc[curr.brand] = 0;
      }
      acc[curr.brand]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sizes = allEntries.reduce(
    (acc, curr) => {
      if (!acc[curr.size]) {
        acc[curr.size] = 0;
      }
      acc[curr.size]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const colors = allEntries.reduce(
    (acc, curr) => {
      curr.colors.forEach((color: string) => {
        if (!acc[color]) {
          acc[color] = 0;
        }
        acc[color]++;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    total: allEntries.length,
    favourites: allEntries.filter((entry) => entry.is_favourite).length,
    categories,
    subcategories,
    brands,
    sizes,
    colors,
  };
};

export const getEntries = async (
  pb: PocketBase,
  filters: {
    category?: string;
    subcategory?: string;
    brand?: string;
    size?: string;
    color?: string;
    favourite?: boolean;
    q?: string;
  },
): Promise<WithPB<IVirtualWardrobeEntry>[]> => {
  const filterArray = [
    filters.category && `category = '${filters.category}'`,
    filters.subcategory && `subcategory = '${filters.subcategory}'`,
    filters.brand && `brand = '${filters.brand}'`,
    filters.size && `size = '${filters.size}'`,
    filters.color && `colors ~ '${filters.color}'`,
    filters.favourite && `is_favourite = ${filters.favourite}`,
    filters.q &&
      `(name ~ '${filters.q}' || brand ~ '${filters.q}' || notes ~ '${filters.q}')`,
  ].filter((e) => e);

  const entries = await pb
    .collection("virtual_wardrobe__entries")
    .getFullList<WithPB<IVirtualWardrobeEntry>>({
      filter: filterArray.join(" && "),
      sort: "-created",
    });

  return entries.map((entry) => ({
    ...entry,
    front_image: pb.files.getURL(entry, entry.front_image).split("/files/")[1],
    back_image: pb.files.getURL(entry, entry.back_image).split("/files/")[1],
  }));
};

export const createEntry = async (
  pb: PocketBase,
  data: {
    name: string;
    category: string;
    subcategory: string;
    brand: string;
    size: string;
    colors: string[];
    price: number;
    notes: string;
    front_image: File;
    back_image: File;
  },
): Promise<WithPB<IVirtualWardrobeEntry>> => {
  const newEntry = await pb
    .collection("virtual_wardrobe__entries")
    .create<WithPB<IVirtualWardrobeEntry>>(data);

  return {
    ...newEntry,
    front_image: pb.files
      .getURL(newEntry, newEntry.front_image)
      .split("/files/")[1],
    back_image: pb.files
      .getURL(newEntry, newEntry.back_image)
      .split("/files/")[1],
  };
};

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  data: Partial<IVirtualWardrobeEntry>,
): Promise<WithPB<IVirtualWardrobeEntry>> => {
  const updatedEntry = await pb
    .collection("virtual_wardrobe__entries")
    .update<WithPB<IVirtualWardrobeEntry>>(id, data);

  return {
    ...updatedEntry,
    front_image: pb.files
      .getURL(updatedEntry, updatedEntry.front_image)
      .split("/files/")[1],
    back_image: pb.files
      .getURL(updatedEntry, updatedEntry.back_image)
      .split("/files/")[1],
  };
};

export const deleteEntry = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("virtual_wardrobe__entries").delete(id);
};

export const toggleFavourite = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IVirtualWardrobeEntry>> => {
  const entry = await pb
    .collection("virtual_wardrobe__entries")
    .getOne<WithPB<IVirtualWardrobeEntry>>(id);

  return await updateEntry(pb, id, {
    is_favourite: !entry.is_favourite,
  });
};
