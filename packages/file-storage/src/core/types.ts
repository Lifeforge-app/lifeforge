import type { Readable } from 'node:stream'

import type { FileReference } from './contract/fileReference'

/**
 * A file held in the staging area, before it is committed to the provider.
 * Produced by the upload middleware; consumed by `FileStorage.save`.
 */
export interface StagedFile {
  readonly __staged: true
  readonly originalName: string
  readonly mimeType: string
  readonly size: number
  /** Absolute path of the staged temp file (in-process convenience). */
  readonly path: string
  read(): Promise<Buffer>
  stream(): Readable
}

/** A file supplied directly as bytes (host-side/migrations). */
export interface BufferUpload {
  buffer: Buffer
  originalName: string
  mimeType: string
}

export interface StoredFileReference extends FileReference {
  moduleId: string
}

/** Persistence boundary between `@lifeforge/file-storage` and the app. */
export interface FileMetadataStore {
  upsert(ref: StoredFileReference): Promise<void>
  get(key: string): Promise<StoredFileReference | null>
  delete(key: string): Promise<void>
}
