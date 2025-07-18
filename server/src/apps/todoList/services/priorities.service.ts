import PocketBase from "pocketbase";
import { TodoListSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllPriorities = (
  pb: PocketBase,
): Promise<
  WithPB<
    TodoListSchemas.IPriority & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__priorities_aggregated").getFullList<
    WithPB<
      TodoListSchemas.IPriority & {
        amount: number;
      }
    >
  >();

export const createPriority = async (
  pb: PocketBase,
  data: Omit<TodoListSchemas.IPriority, "amount">,
): Promise<
  WithPB<
    TodoListSchemas.IPriority & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__priorities")
    .create<WithPB<TodoListSchemas.IPriority>>(data);

  return pb
    .collection("todo_list__priorities_aggregated")
    .getOne<WithPB<TodoListSchemas.IPriority & { amount: number }>>(created.id);
};

export const updatePriority = async (
  pb: PocketBase,
  id: string,
  data: Omit<TodoListSchemas.IPriority, "amount">,
): Promise<
  WithPB<
    TodoListSchemas.IPriority & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__priorities")
    .update<WithPB<TodoListSchemas.IPriority>>(id, data);

  return pb
    .collection("todo_list__priorities_aggregated")
    .getOne<WithPB<TodoListSchemas.IPriority & { amount: number }>>(updated.id);
};

export const deletePriority = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("todo_list__priorities").delete(id);
};
