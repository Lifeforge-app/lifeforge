import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import z from 'zod'

import { EXISTS_IN, existsIn } from './existsIn'

const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email')
})

describe('existsIn', () => {
  it('returns the same schema instance', () => {
    const schema = z.string()

    expect(existsIn(schema, users)).toBe(schema)
  })

  it('binds the table and optional column to the schema', () => {
    const schema = z.string()

    existsIn(schema, users, 'email')

    expect((schema as unknown as Record<symbol, unknown>)[EXISTS_IN]).toEqual({
      table: users,
      column: 'email'
    })
  })

  it('leaves unannotated schemas untouched', () => {
    expect(
      (z.string() as unknown as Record<symbol, unknown>)[EXISTS_IN]
    ).toBeUndefined()
  })
})
