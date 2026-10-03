import { describe, expect, it } from 'vitest'
import z from 'zod'

import { serializeEndpointValue } from './writeContractFile'

function makeValue(output: Record<string, unknown>) {
  return {
    method: 'get' as const,
    description: 'test',
    noAuth: false,
    encrypted: true,
    isDownloadable: false,
    media: null,
    schema: {},
    output
  }
}

describe('serializeEndpointValue', () => {
  it('should drop non-success output keys', () => {
    const serialized = serializeEndpointValue(
      makeValue({
        OK: z.string(),
        NOT_FOUND: true,
        BAD_REQUEST: z.string()
      })
    )

    expect(Object.keys(serialized.output)).toEqual(['OK'])
  })

  it('should keep success output keys untouched', () => {
    const serialized = serializeEndpointValue(
      makeValue({
        OK: z.string(),
        CREATED: z.string(),
        ACCEPTED: z.string(),
        NO_CONTENT: true,
        FORBIDDEN: true
      })
    )

    expect(Object.keys(serialized.output)).toEqual([
      'OK',
      'CREATED',
      'ACCEPTED',
      'NO_CONTENT'
    ])
    expect(serialized.output.NO_CONTENT).toBe(true)
  })

  it('should serialize date outputs as date-time strings', () => {
    const serialized = serializeEndpointValue(
      makeValue({
        OK: z.object({
          created: z.date(),
          updated: z.date().nullable()
        })
      })
    )

    expect(serialized.output.OK.properties.created).toEqual({
      type: 'string',
      format: 'date-time'
    })
    expect(serialized.output.OK.properties.updated.anyOf).toEqual([
      { type: 'string', format: 'date-time' },
      { type: 'null' }
    ])
  })
})
