import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IIdeaBoxContainer } from "../schema";

export const checkContainerExists = async (
  pb: PocketBase,
  id: string,
): Promise<boolean> =>
  !!(await pb
    .collection("idea_box__containers")
    .getOne(id)
    .catch(() => {}));

export const getContainers = async (
  pb: PocketBase,
): Promise<WithPB<IIdeaBoxContainer>[]> =>
  (
    await pb.collection("idea_box__containers_aggregated").getFullList<
      WithPB<
        IIdeaBoxContainer & {
          text_count: number;
          link_count: number;
          image_count: number;
        }
      >
    >({
      sort: "name",
    })
  ).map((container) => ({
    ...container,
    cover: container.cover
      ? pb.files
          .getURL(container, container.cover)
          .replace(`${pb.baseURL}/api/files`, "")
      : "",
  }));

export const createContainer = async (
  pb: PocketBase,
  name: string,
  color: string,
  icon: string,
  coverFile?: File,
): Promise<WithPB<IIdeaBoxContainer>> => {
  const containerData: Pick<IIdeaBoxContainer, "name" | "color" | "icon"> & {
    cover?: File | string;
  } = {
    name,
    color,
    icon,
  };

  if (coverFile) {
    containerData.cover = coverFile;
  } else {
    containerData.cover = "";
  }

  return await pb
    .collection("idea_box__containers")
    .create<WithPB<IIdeaBoxContainer>>(containerData);
};

export const updateContainer = async (
  pb: PocketBase,
  id: string,
  name: string,
  color: string,
  icon: string,
  coverFile?: File | "keep",
): Promise<WithPB<IIdeaBoxContainer>> => {
  const containerData: Pick<IIdeaBoxContainer, "name" | "color" | "icon"> & {
    cover?: File | string;
  } = {
    name,
    color,
    icon,
  };

  if (coverFile !== "keep") {
    containerData.cover = coverFile ?? "";
  }

  return await pb
    .collection("idea_box__containers")
    .update<WithPB<IIdeaBoxContainer>>(id, containerData);
};

export const deleteContainer = async (pb: PocketBase, id: string) => {
  await pb.collection("idea_box__containers").delete(id);
};
