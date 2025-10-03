import type { ISchemaField } from '../SchemaNode/types'

export interface IValueFromRequestNodeData {
  requestType: 'query' | 'body' | 'params' | undefined
  field: ISchemaField | undefined
}
