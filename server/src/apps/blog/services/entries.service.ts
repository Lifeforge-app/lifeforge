import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { BlogCollectionsSchemas } from 'shared/types/collections'

export const getAllEntries = (
  pb: PocketBase
): Promise<ISchemaWithPB<BlogCollectionsSchemas.IEntry>[]> =>
  pb
    .collection('blog__entries')
    .getFullList<ISchemaWithPB<BlogCollectionsSchemas.IEntry>>()
