import { PGlite } from '@electric-sql/pglite'
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import z from 'zod'

import { checkRecordExistence } from './checkRecordExistence'
import { ExistingStore } from './existing'
import { existsIn } from './existsIn'

const calendars = pgTable('calendars', {
  id: uuid('id').primaryKey(),
  name: varchar('name')
})

const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email')
})

const memberships = pgTable(
  'memberships',
  {
    userId: uuid('user_id').notNull(),
    teamId: uuid('team_id').notNull()
  },
  table => [primaryKey({ columns: [table.userId, table.teamId] })]
)

const files = pgTable('files', {
  key: varchar('key').primaryKey()
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
    ).resolves.toBeInstanceOf(ExistingStore)
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
    ).resolves.toBeInstanceOf(ExistingStore)
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
    ).resolves.toBeInstanceOf(ExistingStore)
  })

  it('rejects tables without a single "id" primary key', async () => {
    const composite = z.object({
      membershipId: existsIn(z.string(), memberships)
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema: composite,
        body: { membershipId: EXISTING }
      })
    ).rejects.toThrow('requires a single "id" primary key')

    const nonId = z.object({
      key: existsIn(z.string(), files)
    })

    await expect(
      checkRecordExistence({
        db: db as never,
        bodySchema: nonId,
        body: { key: 'a' }
      })
    ).rejects.toThrow('requires a single "id" primary key')
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
    ).resolves.toBeInstanceOf(ExistingStore)
  })

  it('exposes rows guarded with select: true', async () => {
    const bodySchema = z.object({
      calendarId: existsIn(z.string(), calendars, { select: true })
    })

    const store = await checkRecordExistence({
      db: db as never,
      bodySchema,
      body: { calendarId: EXISTING }
    })

    expect(store.one(calendars, EXISTING)).toMatchObject({
      id: EXISTING,
      name: 'Work'
    })
    expect(() => store.one(calendars, MISSING)).toThrowError()
  })

  it('stores rows for every select: true check across query and body', async () => {
    const querySchema = z.object({
      calendarId: existsIn(z.string(), calendars, { select: true })
    })

    const bodySchema = z.object({
      userId: existsIn(z.string(), users, { select: true })
    })

    const store = await checkRecordExistence({
      db: db as never,
      querySchema,
      query: { calendarId: EXISTING },
      bodySchema,
      body: { userId: EXISTING }
    })

    expect(store.one(calendars, EXISTING)).toMatchObject({ name: 'Work' })
    expect(store.one(users, EXISTING)).toMatchObject({
      email: 'work@example.com'
    })
  })
})
