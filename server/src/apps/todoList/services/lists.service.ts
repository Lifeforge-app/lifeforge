import PocketBase from "pocketbase";
import { TodoListSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllLists = (
  pb: PocketBase,
): Promise<
  WithPB<
    TodoListSchemas.IList & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__lists_aggregated").getFullList<
    WithPB<TodoListSchemas.IList> & {
      amount: number;
    }
  >();

export const createList = async (
  pb: PocketBase,
  data: TodoListSchemas.IList,
): Promise<
  WithPB<
    TodoListSchemas.IList & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__lists")
    .create<WithPB<TodoListSchemas.IList>>(data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<TodoListSchemas.IList> & {
      amount: number;
    }
  >(created.id);
};

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: TodoListSchemas.IList,
): Promise<
  WithPB<
    TodoListSchemas.IList & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__lists")
    .update<WithPB<TodoListSchemas.IList>>(id, data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<
      TodoListSchemas.IList & {
        amount: number;
      }
    >
  >(updated.id);
};

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("todo_list__lists").delete(id);
};
