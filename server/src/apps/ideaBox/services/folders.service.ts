import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IIdeaBoxFolder } from "../schema";

export const getFolders = (
  pb: PocketBase,
  container: string,
  lastFolder: string,
): Promise<WithPB<IIdeaBoxFolder>[]> =>
  pb.collection("idea_box__folders").getFullList<WithPB<IIdeaBoxFolder>>({
    filter: `container = "${container}" && parent = "${lastFolder}"`,
    sort: "name",
  });

export const createFolder = async (
  pb: PocketBase,
  {
    name,
    container,
    parent,
    icon,
    color,
  }: {
    name: string;
    container: string;
    parent: string;
    icon: string;
    color: string;
  },
): Promise<WithPB<IIdeaBoxFolder>> =>
  pb.collection("idea_box__folders").create<WithPB<IIdeaBoxFolder>>({
    name,
    container,
    parent,
    icon,
    color,
  });

export const updateFolder = (
  pb: PocketBase,
  id: string,
  { name, icon, color }: { name: string; icon: string; color: string },
): Promise<WithPB<IIdeaBoxFolder>> =>
  pb.collection("idea_box__folders").update<WithPB<IIdeaBoxFolder>>(id, {
    name,
    icon,
    color,
  });

export const moveFolder = (
  pb: PocketBase,
  id: string,
  target: string,
): Promise<WithPB<IIdeaBoxFolder>> =>
  pb.collection("idea_box__folders").update<WithPB<IIdeaBoxFolder>>(id, {
    parent: target,
  });

export const removeFromFolder = (
  pb: PocketBase,
  id: string,
): Promise<WithPB<IIdeaBoxFolder>> =>
  pb.collection("idea_box__folders").update<WithPB<IIdeaBoxFolder>>(id, {
    parent: "",
  });

export const deleteFolder = async (pb: PocketBase, id: string) => {
  await pb.collection("idea_box__folders").delete(id);
};

export const validateFolderPath = async (
  pb: PocketBase,
  container: string,
  path: string[],
): Promise<{ folderExists: boolean; lastFolder: string }> => {
  let folderExists = true;
  let lastFolder = "";

  for (const folder of path) {
    if (!folder) continue;

    try {
      const folderEntry = await pb
        .collection("idea_box__folders")
        .getOne<WithPB<IIdeaBoxFolder>>(folder);

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
