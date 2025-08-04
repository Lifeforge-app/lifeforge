import Pocketbase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { MusicCollectionsSchemas } from 'shared/types/collections'

let importProgress: 'in_progress' | 'completed' | 'failed' | 'empty' = 'empty'

export const getImportProgress = ():
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'empty' => {
  return importProgress
}

export const setImportProgress = (
  status: 'in_progress' | 'completed' | 'failed' | 'empty'
) => {
  importProgress = status
}

export const getAllEntries = async (
  pb: Pocketbase
): Promise<ISchemaWithPB<MusicCollectionsSchemas.IEntry>[]> =>
  await pb
    .collection('music__entries')
    .getFullList<ISchemaWithPB<MusicCollectionsSchemas.IEntry>>({
      sort: '-is_favourite, name'
    })

export const updateEntry = async (
  pb: Pocketbase,
  id: string,
  data: { name: string; author: string }
): Promise<ISchemaWithPB<MusicCollectionsSchemas.IEntry>> =>
  await pb
    .collection('music__entries')
    .update<ISchemaWithPB<MusicCollectionsSchemas.IEntry>>(id, data)

export const deleteEntry = async (pb: Pocketbase, id: string) => {
  await pb.collection('music__entries').delete(id)
}

export const toggleFavorite = async (
  pb: Pocketbase,
  id: string
): Promise<ISchemaWithPB<MusicCollectionsSchemas.IEntry>> => {
  const entry = await pb.collection('music__entries').getOne(id)

  return await pb.collection('music__entries').update(id, {
    is_favourite: !entry.is_favourite
  })
}
