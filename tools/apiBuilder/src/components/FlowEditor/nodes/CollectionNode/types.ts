import type forgeAPI from '@/utils/forgeAPI'
import type { InferOutput } from 'shared'

export type ICollectionField = InferOutput<
  typeof forgeAPI.database.collections.list
>[number]['fields'][number]

export interface ICollectionNodeData {
  name: string
  type: 'base' | 'view'
  fields: ICollectionField[]
}
