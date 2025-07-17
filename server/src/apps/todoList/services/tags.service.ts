import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { ITodoListTag } from "../schema";

export const getAllTags = (
  pb: PocketBase,
): Promise<
  WithPB<
    ITodoListTag & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__tags_aggregated").getFullList<
    WithPB<
      ITodoListTag & {
        amount: number;
      }
    >
  >();

export const createTag = async (
  pb: PocketBase,
  data: ITodoListTag,
): Promise<
  WithPB<
    ITodoListTag & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__tags")
    .create<WithPB<ITodoListTag>>(data);

  return pb
    .collection("todo_list__tags_aggregated")
    .getOne<WithPB<ITodoListTag & { amount: number }>>(created.id);
};

export const updateTag = async (
  pb: PocketBase,
  id: string,
  data: ITodoListTag,
): Promise<
  WithPB<
    ITodoListTag & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__tags")
    .update<WithPB<ITodoListTag>>(id, data);

  return pb
    .collection("todo_list__tags_aggregated")
    .getOne<WithPB<ITodoListTag & { amount: number }>>(updated.id);
};

export const deleteTag = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("todo_list__tags").delete(id);
};
