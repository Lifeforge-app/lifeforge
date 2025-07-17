export type SchemaWithPB<T> = T & {
  id: string
  collectionName: string
  collectionId: string
  created: string
  updated: string
}
