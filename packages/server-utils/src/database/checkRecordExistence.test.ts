import { PGlite } from '@electric-sql/pglite'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import z from 'zod'

import { checkRecordExistence } from './checkRecordExistence'
import { existsIn } from './existsIn'

const calendars = pgTable('calendars', {
  id: uuid('id').primaryKey(),
  name: varchar('name')
})

const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email')
})

const EXISTING = '11111111-1111-1111-1111-111111111111'
const MISSING = '22222222-2222-2222-2222-222222222222'

describe('checkRecordExistence', () => {
  let client: PGlite
  let db: ReturnType<typeof drizzle>

  beforeAll(async () => {
    client = new PGlite()

    await client.exec(`
      CREATE TABLE calendars (id uuid PRIMARY KEY, name varchar(255));
      CREATE TABLE users (id uuid PRIMARY KEY, email varchar(255));
      INSERT INTO calendars (id, name) VALUES ('${EXISTING}', 'Work');
      INSERT INTO users (id, email) VALUES ('${EXISTING}', 'work@example.com');
    `)

    db = drizzle({ client })
  })

  afterAll(async () => {
    await client.close()
  })

  it('resolves when the referenced record exists', async () => {
    const bodySchema = z.object({
      calendarId: existsIn(z.string(), calendars)
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { calendarId: EXISTING }
      })
    ).resolves.toBeUndefined()
  })

  it('throws a 404 when the referenced record is missing', async () => {
    const bodySchema = z.object({
      calendarId: existsIn(z.string(), calendars)
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { calendarId: MISSING }
      })
    ).rejects.toMatchObject({ code: 404 })
  })

  it('skips absent optional fields', async () => {
    const bodySchema = z.object({
      calendarId: existsIn(z.string().optional(), calendars)
    })

    await expect(
      checkRecordExistence({ db: db as never, bodySchema, body: {} })
    ).resolves.toBeUndefined()
  })

  it('checks every value in an array field', async () => {
    const bodySchema = z.object({
      ids: existsIn(z.array(z.string()), calendars)
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { ids: [EXISTING, MISSING] }
      })
    ).rejects.toMatchObject({ code: 404 })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { ids: [EXISTING] }
      })
    ).resolves.toBeUndefined()
  })

  it('supports custom columns', async () => {
    const bodySchema = z.object({
      email: existsIn(z.string(), users, 'email')
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { email: 'work@example.com' }
      })
    ).resolves.toBeUndefined()

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema,
        body: { email: 'nobody@example.com' }
      })
    ).rejects.toMatchObject({ code: 404 })
  })

  it('checks query schemas too', async () => {
    const querySchema = z.object({ id: existsIn(z.string(), calendars) })

    await expect(
      checkRecordExistence({
        db: db as never,
        querySchema,
        query: { id: MISSING }
      })
    ).rejects.toMatchObject({ code: 404 })
  })

  it('is a no-op without existence checks', async () => {
    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema: z.object({ name: z.string() }),
        body: { name: 'x' }
      })
    ).resolves.toBeUndefined()
  })
})
