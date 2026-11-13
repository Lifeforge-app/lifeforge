import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { StoredFileReference } from '../../core/types'
import { createFileMetadataStore } from './store'

const REF: StoredFileReference = {
  key: 'user/a.png',
  originalName: 'a.png',
  mimeType: 'image/png',
  size: 3,
  thumbs: [
    { size: '256x0', key: 'user/a-thumb-256x0.png', width: 256, height: 128 }
  ],
  moduleId: 'user'
}

const OTHER: StoredFileReference = {
  key: 'user/b.png',
  originalName: 'b.png',
  mimeType: 'image/png',
  size: 5,
  thumbs: [],
  moduleId: 'user'
}

describe('createFileMetadataStore', () => {
  let client: PGlite
  let store: ReturnType<typeof createFileMetadataStore>

  beforeAll(async () => {
    client = new PGlite()

    await client.exec(`
      CREATE TABLE files (
        key varchar(512) PRIMARY KEY,
        original_name varchar(512) NOT NULL,
        mime_type varchar(255) NOT NULL,
        size integer NOT NULL,
        thumbs jsonb NOT NULL DEFAULT '[]'::jsonb,
        module_id varchar(255) NOT NULL,
        created timestamp NOT NULL DEFAULT now()
      );
    `)

    store = createFileMetadataStore(drizzle({ client }) as never)
  })

  afterAll(async () => {
    await client.close()
  })

  it('upserts and reads a reference back', async () => {
    await store.upsert(REF)

    expect(await store.get(REF.key)).toEqual(REF)
  })

  it('updates an existing row on conflict', async () => {
    await store.upsert({ ...REF, size: 99 })

    expect((await store.get(REF.key))?.size).toBe(99)
  })

  it('returns null for an unknown key', async () => {
    expect(await store.get('user/missing.png')).toBeNull()
  })

  it('deletes only the given key', async () => {
    await store.upsert(OTHER)

    await store.delete(OTHER.key)

    expect(await store.get(OTHER.key)).toBeNull()
    expect(await store.get(REF.key)).not.toBeNull()
  })
})
