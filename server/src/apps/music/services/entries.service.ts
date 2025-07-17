import Pocketbase from "pocketbase";
import { MusicSchemas } from "shared";

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
): Promise<WithPB<MusicSchemas.IEntry>[]> =>
  await pb
    .collection("music__entries")
    .getFullList<WithPB<MusicSchemas.IEntry>>({
      sort: "-is_favourite, name",
    });

export const updateEntry = async (
  pb: Pocketbase,
  id: string,
  data: { name: string; author: string },
): Promise<WithPB<MusicSchemas.IEntry>> =>
  await pb
    .collection("music__entries")
    .update<WithPB<MusicSchemas.IEntry>>(id, data);

export const deleteEntry = async (pb: Pocketbase, id: string) => {
  await pb.collection("music__entries").delete(id);
};

export const toggleFavorite = async (
  pb: Pocketbase,
  id: string,
): Promise<WithPB<MusicSchemas.IEntry>> => {
  const entry = await pb.collection("music__entries").getOne(id);
  return await pb.collection("music__entries").update(id, {
    is_favourite: !entry.is_favourite,
  });
};
