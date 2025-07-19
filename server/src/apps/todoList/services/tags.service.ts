import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { TodoListCollectionsSchemas } from 'shared/types/collections'

export const getAllTags = (
  pb: PocketBase
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >[]
> =>
  pb.collection('todo_list__tags_aggregated').getFullList<
    ISchemaWithPB<
      TodoListCollectionsSchemas.ITag & {
        amount: number
      }
    >
  >()

export const createTag = async (
  pb: PocketBase,
  data: TodoListCollectionsSchemas.ITag
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >
> => {
  const created = await pb
    .collection('todo_list__tags')
    .create<ISchemaWithPB<TodoListCollectionsSchemas.ITag>>(data)

  return pb
    .collection('todo_list__tags_aggregated')
    .getOne<
      ISchemaWithPB<TodoListCollectionsSchemas.ITag & { amount: number }>
    >(created.id)
}

export const updateTag = async (
  pb: PocketBase,
  id: string,
  data: TodoListCollectionsSchemas.ITag
): Promise<
  ISchemaWithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >
> => {
  const updated = await pb
    .collection('todo_list__tags')
    .update<ISchemaWithPB<TodoListCollectionsSchemas.ITag>>(id, data)

  return pb
    .collection('todo_list__tags_aggregated')
    .getOne<
      ISchemaWithPB<TodoListCollectionsSchemas.ITag & { amount: number }>
    >(updated.id)
}

export const deleteTag = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection('todo_list__tags').delete(id)
}
