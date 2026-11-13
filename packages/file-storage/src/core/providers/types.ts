import type { Readable } from 'node:stream'

export interface FileStream {
  stream: Readable
  mimeType: string
  size: number
}

export interface ProviderSaveOptions {
  mimeType?: string
}

export interface StorageGetOptions {
  thumb?: string
}

export interface StorageProvider {
  save(
    key: string,
    data: Readable,
    options?: ProviderSaveOptions
  ): Promise<void>
  get(key: string, options?: StorageGetOptions): Promise<FileStream | null>
  delete(key: string): Promise<void>
}
