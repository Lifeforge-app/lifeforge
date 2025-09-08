import type { ISchemaField } from '../SchemaNode/types'

export interface IDeriveSchemaFromCollectionNodeData {
  collectionName: string
  name: string
  typescriptInterfaceName: string
  fields: ISchemaField[]
}
