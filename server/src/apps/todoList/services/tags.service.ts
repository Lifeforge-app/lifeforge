import PocketBase from "pocketbase";
import { TodoListSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllTags = (
  pb: PocketBase,
): Promise<
  WithPB<
    TodoListSchemas.ITag & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__tags_aggregated").getFullList<
    WithPB<
      TodoListSchemas.ITag & {
        amount: number;
      }
    >
  >();

export const createTag = async (
  pb: PocketBase,
  data: TodoListSchemas.ITag,
): Promise<
  WithPB<
    TodoListSchemas.ITag & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__tags")
    .create<WithPB<TodoListSchemas.ITag>>(data);

  return pb
    .collection("todo_list__tags_aggregated")
    .getOne<WithPB<TodoListSchemas.ITag & { amount: number }>>(created.id);
};

export const updateTag = async (
  pb: PocketBase,
  id: string,
  data: TodoListSchemas.ITag,
): Promise<
  WithPB<
    TodoListSchemas.ITag & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__tags")
    .update<WithPB<TodoListSchemas.ITag>>(id, data);

  return pb
    .collection("todo_list__tags_aggregated")
    .getOne<WithPB<TodoListSchemas.ITag & { amount: number }>>(updated.id);
};

export const deleteTag = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("todo_list__tags").delete(id);
};
