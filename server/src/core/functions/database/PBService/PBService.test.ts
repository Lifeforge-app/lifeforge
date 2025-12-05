import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PBService from './index'

// Mock the services
vi.mock('./services/create', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/delete', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/getFirstListItem', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/getFullList', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/getList', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/getOne', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))
vi.mock('./services/update', () => ({
  default: vi.fn((_pb: PocketBase) => ({ collection: vi.fn() }))
}))

describe('PBService', () => {
  let mockPb: PocketBase

  beforeEach(() => {
    mockPb = {} as PocketBase
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should store the PocketBase instance', () => {
      const service = new PBService(mockPb)

      expect(service.instance).toBe(mockPb)
    })
  })

  describe('getters', () => {
    it('should return getFullList service factory', () => {
      const service = new PBService(mockPb)

      const result = service.getFullList

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return getList service factory', () => {
      const service = new PBService(mockPb)

      const result = service.getList

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return getFirstListItem service factory', () => {
      const service = new PBService(mockPb)

      const result = service.getFirstListItem

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return getOne service factory', () => {
      const service = new PBService(mockPb)

      const result = service.getOne

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return create service factory', () => {
      const service = new PBService(mockPb)

      const result = service.create

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return update service factory', () => {
      const service = new PBService(mockPb)

      const result = service.update

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })

    it('should return delete service factory', () => {
      const service = new PBService(mockPb)

      const result = service.delete

      expect(result).toBeDefined()
      expect(result).toHaveProperty('collection')
    })
  })

  describe('service isolation', () => {
    it('should return new factory instances on each getter call', () => {
      const service = new PBService(mockPb)

      const getFullList1 = service.getFullList

      const getFullList2 = service.getFullList

      // Each call to getter should create a new factory
      expect(getFullList1).not.toBe(getFullList2)
    })
  })
})
