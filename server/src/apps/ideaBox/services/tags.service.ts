import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

export const getTags = (
  pb: PocketBase,
  container: string
): Promise<WithPB<IdeaBoxCollectionsSchemas.ITag>[]> =>
  pb
    .collection('idea_box__tags_aggregated')
    .getFullList<WithPB<IdeaBoxCollectionsSchemas.ITag>>({
      filter: `container = "${container}"`
    })

export const createTag = (
  pb: PocketBase,
  container: string,
  {
    name,
    icon,
    color
  }: {
    name: string
    icon: string
    color: string
  }
) =>
  pb
    .collection('idea_box__tags')
    .create<WithPB<IdeaBoxCollectionsSchemas.ITag>>({
      name,
      icon,
      color,
      container
    })

export const updateTag = (
  pb: PocketBase,
  id: string,
  {
    name,
    icon,
    color
  }: {
    name: string
    icon: string
    color: string
  }
): Promise<WithPB<IdeaBoxCollectionsSchemas.ITag>> =>
  pb.collection('idea_box__tags').update(id, {
    name,
    icon,
    color
  })

export const deleteTag = async (pb: PocketBase, id: string) => {
  await pb.collection('idea_box__tags').delete(id)
}
