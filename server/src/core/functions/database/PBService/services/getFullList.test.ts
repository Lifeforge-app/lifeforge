import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import getFullListFactory, { GetFullList } from './getFullList'

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

describe('GetFullList Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockGetFullList: ReturnType<typeof vi.fn>
  let mockFilter: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetFullList = vi.fn().mockResolvedValue([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
      { id: '3', name: 'Item 3' }
    ])
    mockCollection = vi.fn().mockReturnValue({
      getFullList: mockGetFullList
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
      expression: 'active={:param0}',
      params: { param0: true }
    })

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = getFullListFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new GetFullList instance when collection is called', () => {
      const factory = getFullListFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(GetFullList)
    })

    it('should create independent instances for different collections', () => {
      const factory = getFullListFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('GetFullList class', () => {
    describe('filter method', () => {
      it('should set filter and return this for chaining', () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        const result = instance.filter([
          { field: 'active', operator: '=', value: true }
        ] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply filter on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.filter([
          { field: 'active', operator: '=', value: true }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFullList).toHaveBeenCalledWith(
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

        const instance = new GetFullList(mockPb, 'users' as any)

        instance.filter([] as any)
        await instance.execute()

        expect(mockRecursivelyBuildFilter).toHaveBeenCalledWith([])
        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: undefined
          })
        )
      })

      it('should handle multiple filter conditions', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.filter([
          { field: 'active', operator: '=', value: true },
          { field: 'verified', operator: '=', value: true },
          { field: 'age', operator: '>=', value: 18 }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: expect.any(String)
          })
        )
      })

      it('should handle nested combination filters', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.filter([
          {
            combination: '||',
            filters: [
              { field: 'role', operator: '=', value: 'admin' },
              {
                combination: '&&',
                filters: [
                  { field: 'role', operator: '=', value: 'user' },
                  { field: 'premium', operator: '=', value: true }
                ]
              }
            ]
          }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: expect.any(String)
          })
        )
      })
    })

    describe('sort method', () => {
      it('should set sort and return this for chaining', () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        const result = instance.sort(['name', '-created'] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply sort on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.sort(['name', '-created'] as any)
        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            sort: 'name, -created'
          })
        )
      })

      it('should handle empty sort array on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.sort([] as any)
        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            sort: ''
          })
        )
      })

      it('should handle single ascending sort on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.sort(['name'] as any)
        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            sort: 'name'
          })
        )
      })

      it('should handle single descending sort on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.sort(['-created'] as any)
        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            sort: '-created'
          })
        )
      })

      it('should handle multiple mixed sort fields on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        instance.sort(['-priority', 'name', '-created', 'id'] as any)
        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            sort: '-priority, name, -created, id'
          })
        )
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(GetFullList)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).fields({
          id: true,
          name: true
        } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            fields: 'id, name'
          })
        )
      })

      it('should handle empty fields object on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).fields(
          {} as any
        )

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            fields: ''
          })
        )
      })

      it('should preserve filter and sort when adding fields', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created'] as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: expect.any(String),
            sort: '-created',
            fields: 'id, name'
          })
        )
      })

      it('should handle many fields on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).fields({
          id: true,
          name: true,
          email: true,
          avatar: true,
          created: true,
          updated: true,
          role: true,
          status: true
        } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            fields: 'id, name, email, avatar, created, updated, role, status'
          })
        )
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(GetFullList)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).expand({
          profile: 'profiles'
        } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            expand: 'profile'
          })
        )
      })

      it('should handle empty expand object on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).expand(
          {} as any
        )

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            expand: ''
          })
        )
      })

      it('should handle multiple expand relations on execute', async () => {
        const instance = new GetFullList(mockPb, 'users' as any).expand({
          profile: 'profiles',
          settings: 'user_settings',
          posts: 'posts',
          organization: 'organizations'
        } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            expand: 'profile, settings, posts, organization'
          })
        )
      })

      it('should preserve filter and sort when expanding', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created'] as any)
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: expect.any(String),
            sort: '-created',
            expand: 'profile'
          })
        )
      })
    })

    describe('execute method', () => {
      it('should call PocketBase getFullList with correct parameters', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockGetFullList).toHaveBeenCalledWith({
          filter: undefined,
          sort: '',
          expand: '',
          fields: ''
        })
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new GetFullList(mockPb, 'user__notes' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ from middle of collection name', async () => {
        const instance = new GetFullList(mockPb, 'admin_user__records' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__records')
      })

      it('should return all items as array', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(Array.isArray(result)).toBe(true)
        expect(result).toHaveLength(3)
        expect(result[0]).toHaveProperty('id', '1')
      })

      it('should return empty array when no results', async () => {
        mockGetFullList.mockResolvedValue([])

        const instance = new GetFullList(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(result).toEqual([])
        expect(result).toHaveLength(0)
      })

      it('should handle large result sets', async () => {
        const largeResult = Array.from({ length: 1000 }, (_, i) => ({
          id: `id-${i}`,
          name: `Item ${i}`
        }))

        mockGetFullList.mockResolvedValue(largeResult)

        const instance = new GetFullList(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(result).toHaveLength(1000)
      })

      it('should pass all options together', async () => {
        const instance = new GetFullList(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created', 'name'] as any)
          .expand({ profile: 'profiles', settings: 'user_settings' } as any)
          .fields({ id: true, name: true, email: true } as any)

        await instance.execute()

        expect(mockGetFullList).toHaveBeenCalledWith({
          filter: expect.any(String),
          sort: '-created, name',
          expand: 'profile, settings',
          fields: 'id, name, email'
        })
      })

      it('should propagate PocketBase errors', async () => {
        const pbError = new Error('Database connection failed')

        mockGetFullList.mockRejectedValue(pbError)

        const instance = new GetFullList(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Database connection failed'
        )
      })

      it('should handle permission errors', async () => {
        const permissionError = { status: 403, message: 'Access denied' }

        mockGetFullList.mockRejectedValue(permissionError)

        const instance = new GetFullList(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })

      it('should handle network errors', async () => {
        const networkError = new Error('Network request failed')

        mockGetFullList.mockRejectedValue(networkError)

        const instance = new GetFullList(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Network request failed'
        )
      })

      it('should return records with expanded relations', async () => {
        mockGetFullList.mockResolvedValue([
          {
            id: 'user-1',
            name: 'User 1',
            expand: { profile: { id: 'profile-1', bio: 'Hello' } }
          },
          {
            id: 'user-2',
            name: 'User 2',
            expand: { profile: { id: 'profile-2', bio: 'World' } }
          }
        ])

        const instance = new GetFullList(mockPb, 'users' as any).expand({
          profile: 'profiles'
        } as any)

        const result = await instance.execute()

        expect(result).toHaveLength(2)
        expect(result[0].expand?.profile).toBeDefined()
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple getFullList calls from same factory', async () => {
        const factory = getFullListFactory(mockPb)

        await factory.collection('users' as any).execute()
        await factory.collection('posts' as any).execute()
        await factory.collection('comments' as any).execute()

        expect(mockGetFullList).toHaveBeenCalledTimes(3)
        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCollection).toHaveBeenCalledWith('posts')
        expect(mockCollection).toHaveBeenCalledWith('comments')
      })

      it('should not share state between instances', async () => {
        const factory = getFullListFactory(mockPb)

        const instance1 = factory
          .collection('users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)

        const instance2 = factory
          .collection('posts' as any)
          .sort(['-created'] as any)

        await instance1.execute()
        await instance2.execute()

        expect(mockGetFullList).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            filter: expect.any(String),
            sort: ''
          })
        )
        expect(mockGetFullList).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            filter: undefined,
            sort: '-created'
          })
        )
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await getFullListFactory(mockPb)
        .collection('users' as any)
        .filter([{ field: 'active', operator: '=', value: true }] as any)
        .sort(['-created'] as any)
        .execute()

      expect(mockGetFullList).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: expect.any(String),
          sort: '-created'
        })
      )
      expect(result).toBeDefined()
    })

    it('should support complex chaining with all methods', async () => {
      await getFullListFactory(mockPb)
        .collection('users' as any)
        .filter([
          { field: 'active', operator: '=', value: true },
          { field: 'verified', operator: '=', value: true }
        ] as any)
        .sort(['-created', 'name'] as any)
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockGetFullList).toHaveBeenCalledWith({
        filter: expect.any(String),
        sort: '-created, name',
        expand: 'profile, settings',
        fields: 'id, name, email'
      })
    })
  })
})
