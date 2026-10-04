import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import z from 'zod'

import { existsIn } from './existsIn'
import { collectExistenceChecks } from './walk'

const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email')
})

const categories = pgTable('categories', { id: uuid('id').primaryKey() })

describe('collectExistenceChecks', () => {
  it('collects a scalar field with its path', () => {
    const schema = z.object({ userId: existsIn(z.string(), users) })

    expect(collectExistenceChecks(schema, { userId: 'a' }, 'body')).toEqual([
      { path: 'body.userId', table: users, column: undefined, values: ['a'] }
    ])
  })

  it('collects nested object paths', () => {
    const schema = z.object({
      filter: z.object({ userId: existsIn(z.string(), users) })
    })

    expect(
      collectExistenceChecks(schema, { filter: { userId: 'a' } }, 'body')[0]
        .path
    ).toBe('body.filter.userId')
  })

  it('collects array element paths', () => {
    const schema = z.object({
      items: z.array(z.object({ id: existsIn(z.string(), users) }))
    })

    expect(
      collectExistenceChecks(
        schema,
        { items: [{ id: 'a' }, { id: 'b' }] },
        'body'
      ).map(check => check.path)
    ).toEqual(['body.items[0].id', 'body.items[1].id'])
  })

  it('skips absent optional fields', () => {
    const schema = z.object({ userId: existsIn(z.string().optional(), users) })

    expect(collectExistenceChecks(schema, {}, 'body')).toEqual([])
    expect(
      collectExistenceChecks(schema, { userId: 'a' }, 'body')
    ).toHaveLength(1)
  })

  it('finds markers wrapped by optional()', () => {
    const schema = z.object({ userId: existsIn(z.string(), users).optional() })

    expect(
      collectExistenceChecks(schema, { userId: 'a' }, 'body')
    ).toHaveLength(1)
  })

  it('collects array values and custom columns', () => {
    const schema = z.object({
      ids: existsIn(z.array(z.string()), categories),
      email: existsIn(z.string(), users, 'email')
    })

    const checks = collectExistenceChecks(
      schema,
      { ids: ['a', 'b'], email: 'x@y.z' },
      'body'
    )

    expect(checks[0]).toMatchObject({ values: ['a', 'b'] })
    expect(checks[1]).toMatchObject({ column: 'email', values: ['x@y.z'] })
  })

  it('returns nothing for schemas without markers', () => {
    expect(
      collectExistenceChecks(z.object({ name: z.string() }), { name: 'a' })
    ).toEqual([])
  })
})
