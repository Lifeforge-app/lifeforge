import { PGlite } from '@electric-sql/pglite'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import ClientError from '../response/ClientError'
import { mapDatabaseError } from './mapDatabaseError'

const parents = pgTable('parents', { id: uuid('id').primaryKey() })

const children = pgTable('children', {
  id: uuid('id').primaryKey(),
  parentId: uuid('parent_id').references(() => parents.id),
  email: varchar('email').unique()
})

const PARENT = '11111111-1111-1111-1111-111111111111'
const ORPHAN = '99999999-9999-9999-9999-999999999999'

async function capture(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run()
  } catch (err) {
    return err
  }

  throw new Error('Expected the query to reject')
}

describe('mapDatabaseError', () => {
  let client: PGlite
  let db: ReturnType<typeof drizzle>

  beforeAll(async () => {
    client = new PGlite()

    await client.exec(`
      CREATE TABLE parents (id uuid PRIMARY KEY);
      CREATE TABLE children (
        id uuid PRIMARY KEY,
        parent_id uuid REFERENCES parents(id),
        email varchar(255) UNIQUE
      );
    `)

    db = drizzle({ client })

    await db.insert(parents).values({ id: PARENT })
    await db.insert(children).values({
      id: '22222222-2222-2222-2222-222222222222',
      parentId: PARENT,
      email: 'taken@example.com'
    })
  })

  afterAll(async () => {
    await client.close()
  })

  it('maps a real unique violation (23505) to a 409', async () => {
    const err = await capture(() =>
      db.insert(children).values({
        id: '33333333-3333-3333-3333-333333333333',
        parentId: PARENT,
        email: 'taken@example.com'
      })
    )

    const mapped = mapDatabaseError(err)

    expect(mapped).toBeInstanceOf(ClientError)
    expect(mapped?.code).toBe(409)
    expect(mapped?.message).toContain('email')
  })

  it('unwraps the drizzle cause and maps a real FK violation (23503) to a 404', async () => {
    const err = await capture(() =>
      db.insert(children).values({
        id: '44444444-4444-4444-4444-444444444444',
        parentId: ORPHAN,
        email: 'new@example.com'
      })
    )

    const mapped = mapDatabaseError(err)

    expect(mapped).toBeInstanceOf(ClientError)
    expect(mapped?.code).toBe(404)
    expect(mapped?.message).toContain('parents')
  })

  it('returns null for unrelated errors', () => {
    expect(mapDatabaseError(new Error('boom'))).toBeNull()
    expect(mapDatabaseError(null)).toBeNull()
  })
})
