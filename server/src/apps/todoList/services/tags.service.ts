import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { TodoListCollectionsSchemas } from 'shared/types/collections'

export const getAllTags = (
  pb: PocketBase
): Promise<
  WithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >[]
> =>
  pb.collection('todo_list__tags_aggregated').getFullList<
    WithPB<
      TodoListCollectionsSchemas.ITag & {
        amount: number
      }
    >
  >()

export const createTag = async (
  pb: PocketBase,
  data: TodoListCollectionsSchemas.ITag
): Promise<
  WithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >
> => {
  const created = await pb
    .collection('todo_list__tags')
    .create<WithPB<TodoListCollectionsSchemas.ITag>>(data)

  return pb
    .collection('todo_list__tags_aggregated')
    .getOne<
      WithPB<TodoListCollectionsSchemas.ITag & { amount: number }>
    >(created.id)
}

export const updateTag = async (
  pb: PocketBase,
  id: string,
  data: TodoListCollectionsSchemas.ITag
): Promise<
  WithPB<
    TodoListCollectionsSchemas.ITag & {
      amount: number
    }
  >
> => {
  const updated = await pb
    .collection('todo_list__tags')
    .update<WithPB<TodoListCollectionsSchemas.ITag>>(id, data)

  return pb
    .collection('todo_list__tags_aggregated')
    .getOne<
      WithPB<TodoListCollectionsSchemas.ITag & { amount: number }>
    >(updated.id)
}

export const deleteTag = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection('todo_list__tags').delete(id)
}
