import Pocketbase from "pocketbase";
import { MusicCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

let importProgress: "in_progress" | "completed" | "failed" | "empty" = "empty";

export const getImportProgress = ():
  | "in_progress"
  | "completed"
  | "failed"
  | "empty" => {
  return importProgress;
};

export const setImportProgress = (
  status: "in_progress" | "completed" | "failed" | "empty",
) => {
  importProgress = status;
};

export const getAllEntries = async (
  pb: Pocketbase,
): Promise<WithPB<MusicCollectionsSchemas.IEntry>[]> =>
  await pb
    .collection("music__entries")
    .getFullList<WithPB<MusicCollectionsSchemas.IEntry>>({
      sort: "-is_favourite, name",
    });

export const updateEntry = async (
  pb: Pocketbase,
  id: string,
  data: { name: string; author: string },
): Promise<WithPB<MusicCollectionsSchemas.IEntry>> =>
  await pb
    .collection("music__entries")
    .update<WithPB<MusicCollectionsSchemas.IEntry>>(id, data);

export const deleteEntry = async (pb: Pocketbase, id: string) => {
  await pb.collection("music__entries").delete(id);
};

export const toggleFavorite = async (
  pb: Pocketbase,
  id: string,
): Promise<WithPB<MusicCollectionsSchemas.IEntry>> => {
  const entry = await pb.collection("music__entries").getOne(id);

  return await pb.collection("music__entries").update(id, {
    is_favourite: !entry.is_favourite,
  });
};
