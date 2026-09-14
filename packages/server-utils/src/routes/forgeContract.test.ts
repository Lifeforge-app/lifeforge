import { describe, expect, it } from 'vitest'
import z from 'zod'

import { createForgeContractBuilder } from './forgeContract'

describe('createForgeContractBuilder', () => {
  it('should construct query contract and register a callback', () => {
    const forge = createForgeContractBuilder()

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
          })
        }
      })
      .callback(async ({ query, response }) => {
        return response.ok({ message: `Hello ${query?.id}` })
      })

    expect(contract.__isForgeContract).toBe(true)

    const val = contract.getValue()

    expect(val.method).toBe('get')
    expect(val.description).toBe('Test Query')
  })

  it('should default rateLimit to true', () => {
    const forge = createForgeContractBuilder()
    const contract = forge
      .query({
        description: 'Test rateLimit default',
        output: {
          OK: z.string()
        }
      })
      .callback(async ({ response }) => {
        return response.ok('test')
      })

    const val = contract.getValue()
    expect(val.rateLimit).toBe(true)
  })

  it('should set rateLimit to false if explicitly defined', () => {
    const forge = createForgeContractBuilder()
    const contract = forge
      .query({
        description: 'Test rateLimit false',
        rateLimit: false,
        output: {
          OK: z.string()
        }
      })
      .callback(async ({ response }) => {
        return response.ok('test')
      })

    const val = contract.getValue()
    expect(val.rateLimit).toBe(false)
  })
})
