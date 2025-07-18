import PocketBase from "pocketbase";
import { TodoListCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllLists = (
  pb: PocketBase,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__lists_aggregated").getFullList<
    WithPB<TodoListCollectionsSchemas.IList> & {
      amount: number;
    }
  >();

export const createList = async (
  pb: PocketBase,
  data: TodoListCollectionsSchemas.IList,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__lists")
    .create<WithPB<TodoListCollectionsSchemas.IList>>(data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<TodoListCollectionsSchemas.IList> & {
      amount: number;
    }
  >(created.id);
};

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: TodoListCollectionsSchemas.IList,
): Promise<
  WithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__lists")
    .update<WithPB<TodoListCollectionsSchemas.IList>>(id, data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<
      TodoListCollectionsSchemas.IList & {
        amount: number;
      }
    >
  >(updated.id);
};

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("todo_list__lists").delete(id);
};
