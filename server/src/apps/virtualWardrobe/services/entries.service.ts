import PocketBase from "pocketbase";
import { VirtualWardrobeSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getSidebarData = async (
  pb: PocketBase,
): Promise<VirtualWardrobeSchemas.IVirtualWardrobeSidebarData> => {
  const allEntries = await pb
    .collection("virtual_wardrobe__entries")
    .getFullList<WithPB<VirtualWardrobeSchemas.IEntry>>();

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
): Promise<WithPB<VirtualWardrobeSchemas.IEntry>[]> => {
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
    .getFullList<WithPB<VirtualWardrobeSchemas.IEntry>>({
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
): Promise<WithPB<VirtualWardrobeSchemas.IEntry>> => {
  const newEntry = await pb
    .collection("virtual_wardrobe__entries")
    .create<WithPB<VirtualWardrobeSchemas.IEntry>>(data);

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
  data: Partial<VirtualWardrobeSchemas.IEntry>,
): Promise<WithPB<VirtualWardrobeSchemas.IEntry>> => {
  const updatedEntry = await pb
    .collection("virtual_wardrobe__entries")
    .update<WithPB<VirtualWardrobeSchemas.IEntry>>(id, data);

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
): Promise<WithPB<VirtualWardrobeSchemas.IEntry>> => {
  const entry = await pb
    .collection("virtual_wardrobe__entries")
    .getOne<WithPB<VirtualWardrobeSchemas.IEntry>>(id);

  return await updateEntry(pb, id, {
    is_favourite: !entry.is_favourite,
  });
};
