import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { ITodoListList } from "../schema";

export const getAllLists = (
  pb: PocketBase,
): Promise<
  WithPB<
    ITodoListList & {
      amount: number;
    }
  >[]
> =>
  pb.collection("todo_list__lists_aggregated").getFullList<
    WithPB<ITodoListList> & {
      amount: number;
    }
  >();

export const createList = async (
  pb: PocketBase,
  data: ITodoListList,
): Promise<
  WithPB<
    ITodoListList & {
      amount: number;
    }
  >
> => {
  const created = await pb
    .collection("todo_list__lists")
    .create<WithPB<ITodoListList>>(data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<ITodoListList> & {
      amount: number;
    }
  >(created.id);
};

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: ITodoListList,
): Promise<
  WithPB<
    ITodoListList & {
      amount: number;
    }
  >
> => {
  const updated = await pb
    .collection("todo_list__lists")
    .update<WithPB<ITodoListList>>(id, data);

  return pb.collection("todo_list__lists_aggregated").getOne<
    WithPB<
      ITodoListList & {
        amount: number;
      }
    >
  >(updated.id);
};

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection("todo_list__lists").delete(id);
};
