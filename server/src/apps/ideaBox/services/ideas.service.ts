import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

export const getIdeas = (
  pb: PocketBase,
  container: string,
  folder: string,
  archived: boolean
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>[]> =>
  pb
    .collection('idea_box__entries')
    .getFullList<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>({
      filter: `container = "${container}" && archived = ${archived} ${
        folder ? `&& folder = "${folder}"` : "&& folder=''"
      }`,
      sort: '-pinned,-created'
    })

export const validateFolderPath = async (
  pb: PocketBase,
  container: string,
  path: string[]
): Promise<{
  folderExists: boolean
  lastFolder: string
}> => {
  let folderExists = true
  let lastFolder = ''

  for (const folder of path) {
    try {
      const folderEntry = await pb
        .collection('idea_box__folders')
        .getOne<IdeaBoxCollectionsSchemas.IFolder>(folder)

      if (
        folderEntry.parent !== lastFolder ||
        folderEntry.container !== container
      ) {
        folderExists = false
        break
      }

      lastFolder = folder
    } catch {
      folderExists = false
      break
    }
  }

  return { folderExists, lastFolder }
}

export const createIdea = (
  pb: PocketBase,
  data: Omit<
    IdeaBoxCollectionsSchemas.IEntry,
    'image' | 'pinned' | 'archived'
  > & {
    image?: File
  }
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>> =>
  pb
    .collection('idea_box__entries')
    .create<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(data)

export const updateIdea = async (
  pb: PocketBase,
  id: string,
  data: Partial<IdeaBoxCollectionsSchemas.IEntry>
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>> =>
  pb
    .collection('idea_box__entries')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id, data)

export const deleteIdea = async (pb: PocketBase, id: string) => {
  await pb.collection('idea_box__entries').delete(id)
}

export const updatePinStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection('idea_box__entries')
    .getOne<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id)

  const entry = await pb
    .collection('idea_box__entries')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id, {
      pinned: !idea.pinned
    })

  return entry
}

export const updateArchiveStatus = async (pb: PocketBase, id: string) => {
  const idea = await pb
    .collection('idea_box__entries')
    .getOne<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id)

  const entry = await pb
    .collection('idea_box__entries')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id, {
      archived: !idea.archived,
      pinned: false
    })

  return entry
}

export const moveIdea = async (
  pb: PocketBase,
  id: string,
  target: string
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>> =>
  pb
    .collection('idea_box__entries')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id, {
      folder: target
    })

export const removeFromFolder = (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>> =>
  pb
    .collection('idea_box__entries')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>>(id, {
      folder: ''
    })
