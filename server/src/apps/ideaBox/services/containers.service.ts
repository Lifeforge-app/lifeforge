import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

export const checkContainerExists = async (
  pb: PocketBase,
  id: string
): Promise<boolean> =>
  !!(await pb
    .collection('idea_box__containers')
    .getOne(id)
    .catch(() => {}))

export const getContainers = async (
  pb: PocketBase
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainerAggregated>[]> =>
  (
    await pb
      .collection('idea_box__containers_aggregated')
      .getFullList<
        ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainerAggregated>
      >({
        sort: 'name'
      })
  ).map(container => ({
    ...container,
    cover: container.cover
      ? pb.files
          .getURL(container, container.cover)
          .replace(`${pb.baseURL}/api/files`, '')
      : ''
  }))

export const createContainer = async (
  pb: PocketBase,
  name: string,
  color: string,
  icon: string,
  coverFile?: File
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>> => {
  const containerData: Pick<
    IdeaBoxCollectionsSchemas.IContainer,
    'name' | 'color' | 'icon'
  > & {
    cover?: File | string
  } = {
    name,
    color,
    icon
  }

  if (coverFile) {
    containerData.cover = coverFile
  } else {
    containerData.cover = ''
  }

  return await pb
    .collection('idea_box__containers')
    .create<ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>>(containerData)
}

export const updateContainer = async (
  pb: PocketBase,
  id: string,
  name: string,
  color: string,
  icon: string,
  coverFile?: File | 'keep'
): Promise<ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>> => {
  const containerData: Pick<
    IdeaBoxCollectionsSchemas.IContainer,
    'name' | 'color' | 'icon'
  > & {
    cover?: File | string
  } = {
    name,
    color,
    icon
  }

  if (coverFile !== 'keep') {
    containerData.cover = coverFile ?? ''
  }

  return await pb
    .collection('idea_box__containers')
    .update<
      ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>
    >(id, containerData)
}

export const deleteContainer = async (pb: PocketBase, id: string) => {
  await pb.collection('idea_box__containers').delete(id)
}
