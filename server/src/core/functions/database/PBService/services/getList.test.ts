import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import getListFactory, { GetList } from './getList'

// Mock LoggingService
vi.mock('@functions/logging/loggingService', () => ({
  LoggingService: {
    debug: vi.fn()
  }
}))

// Mock recursivelyBuildFilter
const mockRecursivelyBuildFilter = vi.fn()

vi.mock('../utils/recursivelyConstructFilter', () => ({
  recursivelyBuildFilter: (...args: unknown[]) =>
    mockRecursivelyBuildFilter(...args)
}))

describe('GetList Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockGetList: ReturnType<typeof vi.fn>
  let mockFilter: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetList = vi.fn().mockResolvedValue({
      page: 1,
      perPage: 30,
      totalItems: 100,
      totalPages: 4,
      items: [{ id: '1' }, { id: '2' }]
    })
    mockCollection = vi.fn().mockReturnValue({
      getList: mockGetList
    })
    mockFilter = vi
      .fn()
      .mockImplementation((expr, _params) => `filtered:${expr}`)
    mockPb = {
      collection: mockCollection,
      filter: mockFilter
    } as unknown as PocketBase

    // Setup default mock behavior
    mockRecursivelyBuildFilter.mockReturnValue({
      expression: 'name={:param0}',
      params: { param0: 'test' }
    })

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = getListFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new GetList instance when collection is called', () => {
      const factory = getListFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(GetList)
    })

    it('should create independent instances for different collections', () => {
      const factory = getListFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('GetList class', () => {
    describe('page method', () => {
      it('should set page and return this for chaining', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.page(5)

        expect(result).toBe(instance)
      })

      it('should correctly apply page 1 on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.page(1)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1, 30, expect.any(Object))
      })

      it('should correctly apply large page numbers on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.page(1000)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1000, 30, expect.any(Object))
      })

      it('should use the last set page value on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.page(1).page(5).page(10)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(10, 30, expect.any(Object))
      })

      it('should work with page 0 (PocketBase behavior)', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.page(0)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(0, 30, expect.any(Object))
      })
    })

    describe('perPage method', () => {
      it('should set perPage and return this for chaining', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.perPage(50)

        expect(result).toBe(instance)
      })

      it('should correctly apply small perPage values on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.perPage(1)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1, 1, expect.any(Object))
      })

      it('should correctly apply large perPage values on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.perPage(500)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1, 500, expect.any(Object))
      })

      it('should use the last set perPage value on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.perPage(10).perPage(25).perPage(100)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1, 100, expect.any(Object))
      })

      it('should work with perPage 0 (PocketBase behavior)', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.perPage(0)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(1, 0, expect.any(Object))
      })
    })

    describe('filter method', () => {
      it('should set filter and return this for chaining', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.filter([
          { field: 'name', operator: '=', value: 'test' }
        ] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply filter on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.filter([
          { field: 'name', operator: '=', value: 'test' }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            filter: expect.any(String)
          })
        )
      })

      it('should handle empty filter array on execute', async () => {
        mockRecursivelyBuildFilter.mockReturnValue({
          expression: '',
          params: {}
        })

        const instance = new GetList(mockPb, 'users' as any)

        instance.filter([] as any)
        await instance.execute()

        expect(mockRecursivelyBuildFilter).toHaveBeenCalledWith([])
        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            filter: undefined
          })
        )
      })

      it('should handle multiple filter conditions', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.filter([
          { field: 'name', operator: '=', value: 'test' },
          { field: 'active', operator: '=', value: true },
          { field: 'age', operator: '>=', value: 18 }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            filter: expect.any(String)
          })
        )
      })

      it('should handle combination filters', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.filter([
          {
            combination: '||',
            filters: [
              { field: 'role', operator: '=', value: 'admin' },
              { field: 'role', operator: '=', value: 'moderator' }
            ]
          }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            filter: expect.any(String)
          })
        )
      })
    })

    describe('sort method', () => {
      it('should set sort and return this for chaining', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.sort(['name', '-created'] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply single sort field on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.sort(['name'] as any)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            sort: 'name'
          })
        )
      })

      it('should correctly apply descending sort on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.sort(['-created'] as any)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            sort: '-created'
          })
        )
      })

      it('should correctly apply multiple sort fields on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.sort(['name', '-created', 'email', '-updated'] as any)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            sort: 'name, -created, email, -updated'
          })
        )
      })

      it('should handle empty sort array on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        instance.sort([] as any)
        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            sort: ''
          })
        )
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(GetList)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any).fields({
          id: true,
          name: true
        } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            fields: 'id, name'
          })
        )
      })

      it('should preserve pagination settings in new instance', async () => {
        const instance = new GetList(mockPb, 'users' as any)
          .page(3)
          .perPage(25)
          .fields({ id: true } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          3,
          25,
          expect.objectContaining({
            fields: 'id'
          })
        )
      })

      it('should preserve filter and sort in new instance', async () => {
        const instance = new GetList(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created'] as any)
          .fields({ id: true } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            sort: '-created',
            fields: 'id',
            filter: expect.any(String)
          })
        )
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(GetList)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any).expand({
          profile: 'profiles'
        } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            expand: 'profile'
          })
        )
      })

      it('should correctly apply multiple expand relations on execute', async () => {
        const instance = new GetList(mockPb, 'users' as any).expand({
          profile: 'profiles',
          settings: 'user_settings'
        } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          1,
          30,
          expect.objectContaining({
            expand: 'profile, settings'
          })
        )
      })

      it('should preserve pagination settings', async () => {
        const instance = new GetList(mockPb, 'users' as any)
          .page(5)
          .perPage(100)
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(
          5,
          100,
          expect.objectContaining({
            expand: 'profile'
          })
        )
      })
    })

    describe('execute method', () => {
      it('should call PocketBase getList with default pagination', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockGetList).toHaveBeenCalledWith(1, 30, {
          filter: undefined,
          sort: '',
          expand: '',
          fields: ''
        })
      })

      it('should call PocketBase getList with custom pagination', async () => {
        const instance = new GetList(mockPb, 'users' as any).page(3).perPage(50)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(3, 50, expect.any(Object))
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new GetList(mockPb, 'user__notes' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should return paginated result structure', async () => {
        const instance = new GetList(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(result).toHaveProperty('page')
        expect(result).toHaveProperty('perPage')
        expect(result).toHaveProperty('totalItems')
        expect(result).toHaveProperty('totalPages')
        expect(result).toHaveProperty('items')
      })

      it('should return empty items array when no results', async () => {
        mockGetList.mockResolvedValue({
          page: 1,
          perPage: 30,
          totalItems: 0,
          totalPages: 0,
          items: []
        })

        const instance = new GetList(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(result.items).toEqual([])
        expect(result.totalItems).toBe(0)
      })

      it('should pass all options together', async () => {
        const instance = new GetList(mockPb, 'users' as any)
          .page(2)
          .perPage(25)
          .filter([{ field: 'name', operator: '=', value: 'test' }] as any)
          .sort(['name', '-created'] as any)
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetList).toHaveBeenCalledWith(2, 25, {
          filter: expect.any(String),
          sort: 'name, -created',
          expand: 'profile',
          fields: 'id, name'
        })
      })

      it('should propagate PocketBase errors', async () => {
        const pbError = new Error('Database connection failed')

        mockGetList.mockRejectedValue(pbError)

        const instance = new GetList(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Database connection failed'
        )
      })

      it('should handle permission errors', async () => {
        const permissionError = { status: 403, message: 'Access denied' }

        mockGetList.mockRejectedValue(permissionError)

        const instance = new GetList(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple getList calls from same factory', async () => {
        const factory = getListFactory(mockPb)

        await factory
          .collection('users' as any)
          .page(1)
          .execute()
        await factory
          .collection('users' as any)
          .page(2)
          .execute()
        await factory
          .collection('users' as any)
          .page(3)
          .execute()

        expect(mockGetList).toHaveBeenCalledTimes(3)
        expect(mockGetList).toHaveBeenNthCalledWith(
          1,
          1,
          30,
          expect.any(Object)
        )
        expect(mockGetList).toHaveBeenNthCalledWith(
          2,
          2,
          30,
          expect.any(Object)
        )
        expect(mockGetList).toHaveBeenNthCalledWith(
          3,
          3,
          30,
          expect.any(Object)
        )
      })

      it('should not share state between instances', async () => {
        const factory = getListFactory(mockPb)

        const instance1 = factory
          .collection('users' as any)
          .page(5)
          .perPage(10)

        const instance2 = factory
          .collection('posts' as any)
          .page(2)
          .perPage(50)

        await instance1.execute()
        await instance2.execute()

        expect(mockGetList).toHaveBeenNthCalledWith(
          1,
          5,
          10,
          expect.any(Object)
        )
        expect(mockGetList).toHaveBeenNthCalledWith(
          2,
          2,
          50,
          expect.any(Object)
        )
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await getListFactory(mockPb)
        .collection('users' as any)
        .page(2)
        .perPage(20)
        .sort(['-created'] as any)
        .execute()

      expect(mockGetList).toHaveBeenCalledWith(
        2,
        20,
        expect.objectContaining({
          sort: '-created'
        })
      )
      expect(result).toBeDefined()
    })

    it('should support complex chaining with all methods', async () => {
      await getListFactory(mockPb)
        .collection('users' as any)
        .page(1)
        .perPage(25)
        .filter([{ field: 'active', operator: '=', value: true }] as any)
        .sort(['name', '-created'] as any)
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockGetList).toHaveBeenCalledWith(1, 25, {
        filter: expect.any(String),
        sort: 'name, -created',
        expand: 'profile, settings',
        fields: 'id, name, email'
      })
    })
  })
})
