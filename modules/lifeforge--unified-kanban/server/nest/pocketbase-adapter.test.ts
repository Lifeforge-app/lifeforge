import { NotFoundException } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'

import { PocketBaseAdapter } from './pocketbase-adapter'

function mockPb(options: { getOne?: () => Promise<unknown> }) {
  return {
    collection: vi.fn().mockReturnValue({
      getOne: options.getOne ?? vi.fn()
    })
  } as never
}

describe('PocketBaseAdapter', () => {
  describe('getPersonalTask', () => {
    it('returns null when the record does not exist (404)', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockRejectedValue(new NotFoundException('Not found'))
      })

      await expect(adapter.getPersonalTask(pb, 'missing')).resolves.toBeNull()
    })

    it('returns null when PocketBase returns a 404 status error', async () => {
      const adapter = new PocketBaseAdapter()
      const error = Object.assign(new Error('Not found'), { status: 404 })
      const pb = mockPb({ getOne: vi.fn().mockRejectedValue(error) })

      await expect(adapter.getPersonalTask(pb, 'missing')).resolves.toBeNull()
    })

    it('rethrows network and infrastructure errors', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))
      })

      await expect(adapter.getPersonalTask(pb, 'task-1')).rejects.toThrow('ECONNREFUSED')
    })

    it('rethrows auth failures', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockRejectedValue(new Error('401 Unauthorized'))
      })

      await expect(adapter.getPersonalTask(pb, 'task-1')).rejects.toThrow('401 Unauthorized')
    })

    it('rethrows timeout errors', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockRejectedValue(new Error('Timeout'))
      })

      await expect(adapter.getPersonalTask(pb, 'task-1')).rejects.toThrow('Timeout')
    })

    it('rethrows network errors whose message contains "not found"', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockRejectedValue(new Error('Connection to server not found'))
      })

      await expect(adapter.getPersonalTask(pb, 'task-1')).rejects.toThrow('Connection to server not found')
    })

    it('maps a found record to a PersonalTask', async () => {
      const adapter = new PocketBaseAdapter()
      const pb = mockPb({
        getOne: vi.fn().mockResolvedValue({
          id: 'task-1',
          summary: 'Ship it',
          status: 'doing',
          priority: 'high',
          squad_mission_id: 'lifeforge-task-1'
        })
      })

      await expect(adapter.getPersonalTask(pb, 'task-1')).resolves.toEqual({
        id: 'task-1',
        summary: 'Ship it',
        status: 'doing',
        priority: 'high',
        squadMissionId: 'lifeforge-task-1'
      })
    })
  })
})
