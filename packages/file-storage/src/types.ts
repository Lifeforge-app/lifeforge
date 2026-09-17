import type { Readable } from 'node:stream'

export interface FileStream {
  stream: Readable
  mimeType: string
  size: number
}

export interface ProviderSaveOptions {
  mimeType?: string
  size?: number
}

export interface StorageGetOptions {
  thumb?: string
}

export interface StorageProvider {
  save(
    key: string,
    data: Buffer | Readable,
    options?: ProviderSaveOptions
  ): Promise<void>
  get(key: string, options?: StorageGetOptions): Promise<FileStream | null>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

export type DrizzleTableColumns<TTable> = TTable extends {
  $inferSelect: infer TInfer
}
  ? Extract<keyof TInfer, string>
  : TTable extends { _: { columns: infer TCols } }
    ? Extract<keyof TCols, string>
    : string

export type TableKey<TSchema> =
  TSchema extends Record<string, unknown>
    ? Extract<keyof TSchema, string>
    : string

export type FieldKey<TSchema, TTable extends TableKey<TSchema>> =
  TSchema extends Record<string, unknown>
    ? TTable extends keyof TSchema
      ? DrizzleTableColumns<TSchema[TTable]>
      : string
    : string

export interface SaveOptions<
  TSchema extends Record<string, unknown> = Record<string, unknown>,
  TTable extends TableKey<TSchema> = TableKey<TSchema>
> {
  file: Express.Multer.File | Buffer | 'keep' | 'removed' | null | undefined
  currentKey?: string | null
  table: TTable
  field: FieldKey<TSchema, TTable>
  thumbs?: string[]
}

export interface S3ProviderConfig {
  bucket: string
  region?: string
  endpoint?: string
  accessKeyId?: string
  secretAccessKey?: string
  forcePathStyle?: boolean
}
