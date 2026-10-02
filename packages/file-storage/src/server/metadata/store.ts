import { type TablesRelationalConfig, eq } from 'drizzle-orm'

import type { PostgresJsDatabase } from '@lifeforge/drizzle'

import type { FileMetadataStore, StoredFileReference } from '../../core/types'
import { files } from './schema.drizzle'

/** Drizzle-backed metadata store for the file-storage SDK. */
export function createFileMetadataStore<
  TSchema extends TablesRelationalConfig
>(db: PostgresJsDatabase<TSchema>): FileMetadataStore {
  return {
    async upsert(ref: StoredFileReference) {
      const values = {
        key: ref.key,
        originalName: ref.originalName,
        mimeType: ref.mimeType,
        size: ref.size,
        thumbs: ref.thumbs,
        moduleId: ref.moduleId
      }

      await db
        .insert(files)
        .values(values)
        .onConflictDoUpdate({ target: files.key, set: values })
    },

    async get(key: string): Promise<StoredFileReference | null> {
      const [row] = await db
        .select()
        .from(files)
        .where(eq(files.key, key))
        .limit(1)

      if (!row) {
        return null
      }

      return {
        key: row.key,
        originalName: row.originalName,
        mimeType: row.mimeType,
        size: row.size,
        thumbs: row.thumbs,
        moduleId: row.moduleId
      }
    },

    async delete(key: string) {
      await db.delete(files).where(eq(files.key, key))
    }
  }
}
