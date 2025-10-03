import type { InferOutput } from 'shared'

import type forgeAPI from '../../../../utils/forgeAPI'

export type ICollectionField = InferOutput<
  typeof forgeAPI.database.collections.list
>[number]['fields'][number]

export interface ICollectionNodeData {
  name: string
  type: 'base' | 'view'
  fields: ICollectionField[]
}
