import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createDefaultValues } from './createDefaultValues'

describe('createDefaultValues', () => {
  it('should resolve string schema to empty string', () => {
    const schema = z.string()
    expect(createDefaultValues(schema)).toBe('')
  })

  it('should resolve number schema to 0', () => {
    const schema = z.number()
    expect(createDefaultValues(schema)).toBe(0)
  })

  it('should resolve boolean schema to false', () => {
    const schema = z.boolean()
    expect(createDefaultValues(schema)).toBe(false)
  })

  it('should resolve array schema to empty array', () => {
    const schema = z.array(z.string())
    expect(createDefaultValues(schema)).toEqual([])
  })

  it('should resolve object schema to an object with default values recursively', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
      tags: z.array(z.string()),
      nested: z.object({
        value: z.string()
      })
    })

    expect(createDefaultValues(schema)).toEqual({
      name: '',
      age: 0,
      active: false,
      tags: [],
      nested: {
        value: ''
      }
    })
  })

  it('should resolve optional schema to undefined', () => {
    const schema = z.string().optional()
    expect(createDefaultValues(schema)).toBeUndefined()
  })

  it('should resolve nullable schema to null', () => {
    const schema = z.string().nullable()
    expect(createDefaultValues(schema)).toBeNull()
  })

  it('should resolve default schema to the specified default value', () => {
    const schema1 = z.string().default('hello')
    const schema2 = z.string().default(function () {
      return 'dynamic-hello'
    })

    expect(createDefaultValues(schema1)).toBe('hello')
    expect(createDefaultValues(schema2)).toBe('dynamic-hello')
  })

  it('should resolve readonly schema to its inner default value', () => {
    const schema = z.string().readonly()
    expect(createDefaultValues(schema)).toBe('')
  })

  it('should resolve lazy schema to its inner default value', () => {
    const schema = z.lazy(function () {
      return z.string()
    })
    expect(createDefaultValues(schema)).toBe('')
  })

  it('should resolve pipe/transform schema to its inner default value', () => {
    const schema = z.string().transform(function (val) {
      return val.length
    })
    expect(createDefaultValues(schema)).toBe('')
  })

  it('should resolve unsupported schemas to undefined', () => {
    const schema1 = z.date()
    const schema2 = z.enum(['active', 'inactive'])

    expect(createDefaultValues(schema1)).toBeUndefined()
    expect(createDefaultValues(schema2)).toBeUndefined()
  })
})
