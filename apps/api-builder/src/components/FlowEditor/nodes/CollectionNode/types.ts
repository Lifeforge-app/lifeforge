export interface ICollectionField {
  name: string
  type:
    | 'text'
    | 'richtext'
    | 'number'
    | 'bool'
    | 'email'
    | 'url'
    | 'date'
    | 'autodate'
    | 'select'
    | 'file'
    | 'relation'
    | 'json'
    | 'geoPoint'
    | 'password'
  optional: boolean
  values?: string[]
}

export interface ICollectionNodeData {
  name: string
  type: 'base' | 'view'
  fields: ICollectionField[]
}
