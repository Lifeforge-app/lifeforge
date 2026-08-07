import { describe, expect, it } from 'vitest'
import z from 'zod'

import { createForgeContractBuilder } from './forgeContract'

describe('createForgeContractBuilder Type Constraints', () => {
  it('should construct query contract and allow existenceCheck when NOT_FOUND is declared', () => {
    const forge = createForgeContractBuilder({
      categories: {
        schema: z.object({}),
        raw: {}
      }
    })

    const contract = forge
      .query({
        description: 'Test Query',
        input: {
          query: z.object({
            id: z.string()
          })
        },
        output: {
          OK: z.object({
            message: z.string()
          }),
          NOT_FOUND: true
        },
        existenceCheck: {
          query: {
            id: 'categories'
          }
        }
      })
      .callback(async function ({ query, response }) {
        if (query?.id === '404') {
          return response.notFound()
        }

        return response.ok({ message: `Hello ${query?.id}` })
      })

    expect(contract.__isForgeContract).toBe(true)

    const val = contract.getValue()

    expect(val.method).toBe('get')
    expect(val.description).toBe('Test Query')
    expect(val.existenceCheck).toEqual({
      query: {
        id: 'categories'
      }
    })
  })

  it('should default rateLimit to true', () => {
    const forge = createForgeContractBuilder({})
    const contract = forge
      .query({
        description: 'Test rateLimit default',
        output: {
          OK: z.string()
        }
      })
      .callback(async function ({ response }) {
        return response.ok('test')
      })

    const val = contract.getValue()
    expect(val.rateLimit).toBe(true)
  })

  it('should set rateLimit to false if explicitly defined', () => {
    const forge = createForgeContractBuilder({})
    const contract = forge
      .query({
        description: 'Test rateLimit false',
        rateLimit: false,
        output: {
          OK: z.string()
        }
      })
      .callback(async function ({ response }) {
        return response.ok('test')
      })

    const val = contract.getValue()
    expect(val.rateLimit).toBe(false)
  })
})
