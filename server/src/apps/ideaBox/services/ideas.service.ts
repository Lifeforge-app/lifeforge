import PocketBase from "pocketbase";
import { IdeaBoxSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getIdeas = (
  pb: PocketBase,
  container: string,
  folder: string,
  archived: boolean,
): Promise<WithPB<IdeaBoxSchemas.IEntry>[]> =>
  pb
    .collection("idea_box__entries")
    .getFullList<WithPB<IdeaBoxSchemas.IEntry>>({
      filter: `container = "${container}" && archived = ${archived} ${
        folder ? `&& folder = "${folder}"` : "&& folder=''"
      }`,
      sort: "-pinned,-created",
    });

export const validateFolderPath = async (
  pb: PocketBase,
  container: string,
  path: string[],
): Promise<{
  folderExists: boolean;
  lastFolder: string;
}> => {
  let folderExists = true;
  let lastFolder = "";

  for (const folder of path) {
    try {
      const folderEntry = await pb
        .collection("idea_box__folders")
        .getOne<IdeaBoxSchemas.IFolder>(folder);

      if (
        folderEntry.parent !== lastFolder ||
        folderEntry.container !== container
      ) {
        folderExists = false;
        break;
      }

      lastFolder = folder;
    } catch (error) {
      folderExists = false;
      break;
    }
  }

  return { folderExists, lastFolder };
};

export const createIdea = (
  pb: PocketBase,
  data: Omit<IdeaBoxSchemas.IEntry, "image" | "pinned" | "archived"> & {
    image?: File;
  },
): Promise<WithPB<IdeaBoxSchemas.IEntry>> =>
  pb
    .collection("idea_box__entries")
    .create<WithPB<IdeaBoxSchemas.IEntry>>(data);

export const updateIdea = async (
  pb: PocketBase,
  id: string,
  data: Partial<IdeaBoxSchemas.IEntry>,
): Promise<WithPB<IdeaBoxSchemas.IEntry>> =>
  pb
    .collection("idea_box__entries")
    .update<WithPB<IdeaBoxSchemas.IEntry>>(id, data);

export const deleteIdea = async (pb: PocketBase, id: string) => {
  await pb.collection("idea_box__entries").delete(id);
};

export const updatePinStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection("idea_box__entries")
    .getOne<WithPB<IdeaBoxSchemas.IEntry>>(id);

  const entry = await pb
    .collection("idea_box__entries")
    .update<WithPB<IdeaBoxSchemas.IEntry>>(id, {
      pinned: !idea.pinned,
    });

  return entry;
};

export const updateArchiveStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection("idea_box__entries")
    .getOne<WithPB<IdeaBoxSchemas.IEntry>>(id);

  const entry = await pb
    .collection("idea_box__entries")
    .update<WithPB<IdeaBoxSchemas.IEntry>>(id, {
      archived: !idea.archived,
      pinned: false,
    });

  return entry;
};

export const moveIdea = async (
  pb: PocketBase,
  id: string,
  target: string,
): Promise<WithPB<IdeaBoxSchemas.IEntry>> =>
  pb.collection("idea_box__entries").update<WithPB<IdeaBoxSchemas.IEntry>>(id, {
    folder: target,
  });

export const removeFromFolder = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IdeaBoxSchemas.IEntry>> =>
  pb.collection("idea_box__entries").update<WithPB<IdeaBoxSchemas.IEntry>>(id, {
    folder: "",
  });
