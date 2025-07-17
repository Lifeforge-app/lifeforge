import Pocketbase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IMusicEntry } from "../schema";

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
): Promise<WithPB<IMusicEntry>[]> =>
  await pb.collection("music__entries").getFullList<WithPB<IMusicEntry>>({
    sort: "-is_favourite, name",
  });

export const updateEntry = async (
  pb: Pocketbase,
  id: string,
  data: { name: string; author: string },
): Promise<WithPB<IMusicEntry>> =>
  await pb.collection("music__entries").update<WithPB<IMusicEntry>>(id, data);

export const deleteEntry = async (pb: Pocketbase, id: string) => {
  await pb.collection("music__entries").delete(id);
};

export const toggleFavorite = async (
  pb: Pocketbase,
  id: string,
): Promise<WithPB<IMusicEntry>> => {
  const entry = await pb.collection("music__entries").getOne(id);
  return await pb.collection("music__entries").update(id, {
    is_favourite: !entry.is_favourite,
  });
};
