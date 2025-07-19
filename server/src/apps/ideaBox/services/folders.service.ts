import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

export const getFolders = (
  pb: PocketBase,
  container: string,
  lastFolder: string
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>[]> =>
  pb
    .collection('idea_box__folders')
    .getFullList<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>({
      filter: `container = "${container}" && parent = "${lastFolder}"`,
      sort: 'name'
    })

export const createFolder = async (
  pb: PocketBase,
  {
    name,
    container,
    parent,
    icon,
    color
  }: {
    name: string
    container: string
    parent: string | undefined
    icon: string
    color: string
  }
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>> =>
  pb
    .collection('idea_box__folders')
    .create<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>({
      name,
      container,
      parent,
      icon,
      color
    })

export const updateFolder = (
  pb: PocketBase,
  id: string,
  { name, icon, color }: { name: string; icon: string; color: string }
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>> =>
  pb
    .collection('idea_box__folders')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>(id, {
      name,
      icon,
      color
    })

export const moveFolder = (
  pb: PocketBase,
  id: string,
  target: string
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>> =>
  pb
    .collection('idea_box__folders')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>(id, {
      parent: target
    })

export const removeFromFolder = (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>> =>
  pb
    .collection('idea_box__folders')
    .update<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>(id, {
      parent: ''
    })

export const deleteFolder = async (pb: PocketBase, id: string) => {
  await pb.collection('idea_box__folders').delete(id)
}

export const validateFolderPath = async (
  pb: PocketBase,
  container: string,
  path: string[]
): Promise<{ folderExists: boolean; lastFolder: string }> => {
  let folderExists = true
  let lastFolder = ''

  for (const folder of path) {
    if (!folder) continue

    try {
      const folderEntry = await pb
        .collection('idea_box__folders')
        .getOne<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>(folder)

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
