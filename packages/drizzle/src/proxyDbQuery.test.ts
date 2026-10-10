import { PGlite } from '@electric-sql/pglite'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { composeRelations } from './composeRelations'
import { defineModuleSchema } from './defineModuleSchema'
import { scopeDbForModule } from './proxyDbQuery'

const events = pgTable('app__events', {
  id: uuid('id').primaryKey(),
  title: varchar('title'),
  category_id: uuid('category_id')
})

const categories = pgTable('app__categories', {
  id: uuid('id').primaryKey(),
  name: varchar('name')
})

const tags = pgTable('app__tags', {
  id: uuid('id').primaryKey(),
  label: varchar('label')
})

const appSchema = defineModuleSchema(
  { events, categories },
  r => ({
    events: {
      category: r.one.categories({
        from: r.events.category_id,
        to: r.categories.id
      })
    }
  }),
  'lifeforge--app'
)

const tagsSchema = defineModuleSchema({ tags }, () => ({}), 'lifeforge--tags')

describe('scopeDbForModule (real PGlite)', () => {
  let client: PGlite
  let db: any

  beforeAll(async () => {
    client = new PGlite()

    await client.exec(`
      CREATE TABLE app__categories (id uuid PRIMARY KEY, name varchar);
      CREATE TABLE app__events (id uuid PRIMARY KEY, title varchar, category_id uuid REFERENCES app__categories(id));
      CREATE TABLE app__tags (id uuid PRIMARY KEY, label varchar);
      INSERT INTO app__categories VALUES ('11111111-1111-1111-1111-111111111111', 'Work');
      INSERT INTO app__events VALUES ('22222222-2222-2222-2222-222222222222', 'Standup', '11111111-1111-1111-1111-111111111111');
      INSERT INTO app__tags VALUES ('33333333-3333-3333-3333-333333333333', 'urgent');
    `)

    db = drizzle({
      client,
      relations: composeRelations([appSchema, tagsSchema])
    })
  })

  afterAll(async () => {
    await client.close()
  })

  it('resolves bare query keys to the namespaced tables', async () => {
    const scoped: any = scopeDbForModule(db, appSchema.keyMap)

    const rows = await scoped.query.events.findMany({
      with: { category: true }
    })

    expect(rows).toHaveLength(1)
    expect(rows[0].title).toBe('Standup')
    expect(rows[0].category.name).toBe('Work')
  })

  it('passes non-query members through', async () => {
    const scoped: any = scopeDbForModule(db, appSchema.keyMap)

    expect(await scoped.select().from(events)).toHaveLength(1)
  })

  it('keeps the transaction callback scoped', async () => {
    const scoped: any = scopeDbForModule(db, appSchema.keyMap)

    const title = await scoped.transaction(async (tx: any) => {
      const rows = await tx.query.events.findMany({ with: { category: true } })

      return rows[0].title
    })

    expect(title).toBe('Standup')
  })

  it('leaves keys not in the keyMap unresolved', () => {
    const scoped: any = scopeDbForModule(db, appSchema.keyMap)

    expect(scoped.query.tags).toBeUndefined()
  })

  it('re-scopes an already scoped db for another module', async () => {
    const scoped: any = scopeDbForModule(db, appSchema.keyMap)

    const rescoped: any = scopeDbForModule(scoped, tagsSchema.keyMap)

    const rows = await rescoped.query.tags.findMany()

    expect(rows).toHaveLength(1)
    expect(rows[0].label).toBe('urgent')
  })

  it('returns the db untouched with no keyMap', () => {
    expect(scopeDbForModule(db, undefined)).toBe(db)
  })
})
