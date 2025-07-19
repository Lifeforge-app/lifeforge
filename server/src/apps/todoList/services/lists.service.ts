import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { TodoListCollectionsSchemas } from 'shared/types/collections'

export const getAllLists = (
  pb: PocketBase
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number
    }
  >[]
> =>
  pb.collection('todo_list__lists_aggregated').getFullList<
    ISchemaWithPB<TodoListCollectionsSchemas.IList> & {
      amount: number
    }
  >()

export const createList = async (
  pb: PocketBase,
  data: TodoListCollectionsSchemas.IList
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number
    }
  >
> => {
  const created = await pb
    .collection('todo_list__lists')
    .create<ISchemaWithPB<TodoListCollectionsSchemas.IList>>(data)

  return pb.collection('todo_list__lists_aggregated').getOne<
    ISchemaWithPB<TodoListCollectionsSchemas.IList> & {
      amount: number
    }
  >(created.id)
}

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: TodoListCollectionsSchemas.IList
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IList & {
      amount: number
    }
  >
> => {
  const updated = await pb
    .collection('todo_list__lists')
    .update<ISchemaWithPB<TodoListCollectionsSchemas.IList>>(id, data)

  return pb.collection('todo_list__lists_aggregated').getOne<
    ISchemaWithPB<
      TodoListCollectionsSchemas.IList & {
        amount: number
      }
    >
  >(updated.id)
}

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection('todo_list__lists').delete(id)
}
