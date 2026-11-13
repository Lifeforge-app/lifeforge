import { describe, expect, it } from 'vitest'
import z from 'zod'

import { createOutputHelpers } from './index'

describe('createOutputHelpers', () => {
  it('should always expose the universal error helpers', () => {
    const helpers = createOutputHelpers({ OK: z.string() })

    expect(helpers.ok).toBeTypeOf('function')
    expect(helpers.badRequest).toBeTypeOf('function')
    expect(helpers.unauthorized).toBeTypeOf('function')
    expect(helpers.forbidden).toBeTypeOf('function')
    expect(helpers.notFound).toBeTypeOf('function')
    expect(helpers.conflict).toBeTypeOf('function')

    expect(helpers.badRequest('nope')).toEqual({
      $status: 400,
      payload: 'nope'
    })
    expect(helpers.unauthorized()).toEqual({ $status: 401 })
    expect(helpers.forbidden()).toEqual({ $status: 403 })
    expect(helpers.notFound()).toEqual({ $status: 404 })
    expect(helpers.conflict()).toEqual({ $status: 409 })
  })

  it('should ignore non-success output keys at runtime', () => {
    const helpers = createOutputHelpers({
      OK: z.string(),
      NOT_FOUND: true,
      BAD_REQUEST: z.string()
    } as { OK: z.ZodTypeAny })

    expect(helpers.notFound()).toEqual({ $status: 404 })
    expect(helpers.badRequest('bad')).toEqual({
      $status: 400,
      payload: 'bad'
    })
  })

  it('should return no helpers for custom output', () => {
    const helpers = createOutputHelpers('custom')

    expect(Object.keys(helpers)).toHaveLength(0)
  })
})
