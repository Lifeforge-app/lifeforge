import PocketBase from "pocketbase";
import { TodoListCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllPriorities = (
  pb: PocketBase,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__priorities_aggregated").getFullList<
    WithPB<
      TodoListCollectionsSchemas.IPriority & {
        amount: number;
      }
    >
  >();

export const createPriority = async (
  pb: PocketBase,
  data: Omit<TodoListCollectionsSchemas.IPriority, "amount">,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__priorities")
    .create<WithPB<TodoListCollectionsSchemas.IPriority>>(data);

  return pb
    .collection("todo_list__priorities_aggregated")
    .getOne<
      WithPB<TodoListCollectionsSchemas.IPriority & { amount: number }>
    >(created.id);
};

export const updatePriority = async (
  pb: PocketBase,
  id: string,
  data: Omit<TodoListCollectionsSchemas.IPriority, "amount">,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__priorities")
    .update<WithPB<TodoListCollectionsSchemas.IPriority>>(id, data);

  return pb
    .collection("todo_list__priorities_aggregated")
    .getOne<
      WithPB<TodoListCollectionsSchemas.IPriority & { amount: number }>
    >(updated.id);
};

export const deletePriority = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("todo_list__priorities").delete(id);
};
