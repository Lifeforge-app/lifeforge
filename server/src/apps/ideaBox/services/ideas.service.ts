import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IIdeaBoxEntry, IIdeaBoxFolder } from "../schema";

export const getIdeas = (
  pb: PocketBase,
  container: string,
  folder: string,
  archived: boolean,
): Promise<WithPB<IIdeaBoxEntry>[]> =>
  pb.collection("idea_box__entries").getFullList<WithPB<IIdeaBoxEntry>>({
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
        .getOne<IIdeaBoxFolder>(folder);

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
  data: Omit<IIdeaBoxEntry, "image" | "pinned" | "archived"> & {
    image?: File;
  },
): Promise<WithPB<IIdeaBoxEntry>> =>
  pb.collection("idea_box__entries").create<WithPB<IIdeaBoxEntry>>(data);

export const updateIdea = async (
  pb: PocketBase,
  id: string,
  data: Partial<IIdeaBoxEntry>,
): Promise<WithPB<IIdeaBoxEntry>> =>
  pb.collection("idea_box__entries").update<WithPB<IIdeaBoxEntry>>(id, data);

export const deleteIdea = async (pb: PocketBase, id: string) => {
  await pb.collection("idea_box__entries").delete(id);
};

export const updatePinStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection("idea_box__entries")
    .getOne<WithPB<IIdeaBoxEntry>>(id);

  const entry = await pb
    .collection("idea_box__entries")
    .update<WithPB<IIdeaBoxEntry>>(id, {
      pinned: !idea.pinned,
    });

  return entry;
};

export const updateArchiveStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection("idea_box__entries")
    .getOne<WithPB<IIdeaBoxEntry>>(id);

  const entry = await pb
    .collection("idea_box__entries")
    .update<WithPB<IIdeaBoxEntry>>(id, {
      archived: !idea.archived,
      pinned: false,
    });

  return entry;
};

export const moveIdea = async (
  pb: PocketBase,
  id: string,
  target: string,
): Promise<WithPB<IIdeaBoxEntry>> =>
  pb.collection("idea_box__entries").update<WithPB<IIdeaBoxEntry>>(id, {
    folder: target,
  });

export const removeFromFolder = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IIdeaBoxEntry>> =>
  pb.collection("idea_box__entries").update<WithPB<IIdeaBoxEntry>>(id, {
    folder: "",
  });
