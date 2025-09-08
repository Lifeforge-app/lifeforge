export interface ISchemaField {
  name: string
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'url'
    | 'date'
    | 'enum'
    | 'file'
    | 'object'
    | 'any'
    | 'unknown'
  isOptional?: boolean
  defaultValue?: any
  options?: string[] // For enum types
}

export interface ISchemaNodeData {
  name: string
  fields: ISchemaField[]
}

export interface ISchemaNodeNode {
  id: string
  type: 'schema'
  position: { x: number; y: number }
  data: ISchemaNodeData
}
