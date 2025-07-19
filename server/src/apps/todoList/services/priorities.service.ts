import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { TodoListCollectionsSchemas } from 'shared/types/collections'

export const getAllPriorities = (
  pb: PocketBase
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number
    }
  >[]
> =>
  pb.collection('todo_list__priorities_aggregated').getFullList<
    ISchemaWithPB<
      TodoListCollectionsSchemas.IPriority & {
        amount: number
      }
    >
  >()

export const createPriority = async (
  pb: PocketBase,
  data: Omit<TodoListCollectionsSchemas.IPriority, 'amount'>
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number
    }
  >
> => {
  const created = await pb
    .collection('todo_list__priorities')
    .create<ISchemaWithPB<TodoListCollectionsSchemas.IPriority>>(data)

  return pb
    .collection('todo_list__priorities_aggregated')
    .getOne<
      ISchemaWithPB<TodoListCollectionsSchemas.IPriority & { amount: number }>
    >(created.id)
}

export const updatePriority = async (
  pb: PocketBase,
  id: string,
  data: Omit<TodoListCollectionsSchemas.IPriority, 'amount'>
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.IPriority & {
      amount: number
    }
  >
> => {
  const updated = await pb
    .collection('todo_list__priorities')
    .update<ISchemaWithPB<TodoListCollectionsSchemas.IPriority>>(id, data)

  return pb
    .collection('todo_list__priorities_aggregated')
    .getOne<
      ISchemaWithPB<TodoListCollectionsSchemas.IPriority & { amount: number }>
    >(updated.id)
}

export const deletePriority = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('todo_list__priorities').delete(id)
}
