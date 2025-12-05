import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import getFirstListItemFactory, { GetFirstListItem } from './getFirstListItem'

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

describe('GetFirstListItem Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockGetFirstListItem: ReturnType<typeof vi.fn>
  let mockFilter: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetFirstListItem = vi
      .fn()
      .mockResolvedValue({ id: '1', name: 'First Item' })
    mockCollection = vi.fn().mockReturnValue({
      getFirstListItem: mockGetFirstListItem
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
      const factory = getFirstListItemFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new GetFirstListItem instance when collection is called', () => {
      const factory = getFirstListItemFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(GetFirstListItem)
    })

    it('should create independent instances for different collections', () => {
      const factory = getFirstListItemFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('GetFirstListItem class', () => {
    describe('filter method', () => {
      it('should set filter and return this for chaining', () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        const result = instance.filter([
          { field: 'active', operator: '=', value: true }
        ] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply filter on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.filter([
          { field: 'active', operator: '=', value: true }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object)
        )
      })

      it('should handle empty filter array on execute', async () => {
        mockRecursivelyBuildFilter.mockReturnValue({
          expression: '',
          params: {}
        })

        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.filter([] as any)
        await instance.execute()

        expect(mockRecursivelyBuildFilter).toHaveBeenCalledWith([])
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.any(Object)
        )
      })

      it('should handle multiple filter conditions', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.filter([
          { field: 'active', operator: '=', value: true },
          { field: 'verified', operator: '=', value: true },
          { field: 'role', operator: '=', value: 'admin' }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object)
        )
      })

      it('should handle OR combination filters', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.filter([
          {
            combination: '||',
            filters: [
              { field: 'email', operator: '~', value: '@admin.com' },
              { field: 'role', operator: '=', value: 'admin' }
            ]
          }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object)
        )
      })

      it('should handle deeply nested combination filters', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.filter([
          {
            combination: '&&',
            filters: [
              { field: 'active', operator: '=', value: true },
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
            ]
          }
        ] as any)
        await instance.execute()

        expect(mockFilter).toHaveBeenCalled()
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object)
        )
      })
    })

    describe('sort method', () => {
      it('should set sort and return this for chaining', () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        const result = instance.sort(['name', '-created'] as any)

        expect(result).toBe(instance)
      })

      it('should correctly apply sort on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.sort(['name', '-created'] as any)
        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith('id != ""', {
          sort: 'name, -created',
          expand: '',
          fields: ''
        })
      })

      it('should handle empty sort array on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.sort([] as any)
        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith('id != ""', {
          sort: '',
          expand: '',
          fields: ''
        })
      })

      it('should correctly apply descending sort for getting latest', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.sort(['-created'] as any)
        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            sort: '-created'
          })
        )
      })

      it('should correctly apply ascending sort for getting oldest', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        instance.sort(['created'] as any)
        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            sort: 'created'
          })
        )
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(GetFirstListItem)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any).fields({
          id: true,
          name: true
        } as any)

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            fields: 'id, name'
          })
        )
      })

      it('should handle empty fields object on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any).fields(
          {} as any
        )

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            fields: ''
          })
        )
      })

      it('should preserve filter and sort when adding fields', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created'] as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            sort: '-created',
            fields: 'id, name'
          })
        )
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(GetFirstListItem)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any).expand({
          profile: 'profiles'
        } as any)

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            expand: 'profile'
          })
        )
      })

      it('should handle empty expand object on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any).expand(
          {} as any
        )

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            expand: ''
          })
        )
      })

      it('should handle multiple expand relations on execute', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any).expand({
          profile: 'profiles',
          settings: 'user_settings',
          organization: 'organizations'
        } as any)

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            expand: 'profile, settings, organization'
          })
        )
      })
    })

    describe('execute method', () => {
      it('should call PocketBase getFirstListItem with default filter', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockGetFirstListItem).toHaveBeenCalledWith('id != ""', {
          sort: '',
          expand: '',
          fields: ''
        })
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new GetFirstListItem(mockPb, 'user__notes' as any)

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ from middle of collection name', async () => {
        const instance = new GetFirstListItem(
          mockPb,
          'admin_user__records' as any
        )

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__records')
      })

      it('should return the first matching item', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)

        const result = await instance.execute()

        expect(result).toHaveProperty('id', '1')
        expect(result).toHaveProperty('name', 'First Item')
      })

      it('should pass all options together', async () => {
        const instance = new GetFirstListItem(mockPb, 'users' as any)
          .filter([{ field: 'active', operator: '=', value: true }] as any)
          .sort(['-created'] as any)
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetFirstListItem).toHaveBeenCalledWith(expect.any(String), {
          sort: '-created',
          expand: 'profile',
          fields: 'id, name'
        })
      })

      it('should propagate 404 error when no matching item', async () => {
        const notFoundError = {
          status: 404,
          message: 'The requested resource was not found.'
        }

        mockGetFirstListItem.mockRejectedValue(notFoundError)

        const instance = new GetFirstListItem(mockPb, 'users' as any).filter([
          { field: 'id', operator: '=', value: 'non-existent' }
        ] as any)

        await expect(instance.execute()).rejects.toEqual(notFoundError)
      })

      it('should propagate permission errors', async () => {
        const permissionError = { status: 403, message: 'Access denied' }

        mockGetFirstListItem.mockRejectedValue(permissionError)

        const instance = new GetFirstListItem(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })

      it('should propagate network errors', async () => {
        const networkError = new Error('Network request failed')

        mockGetFirstListItem.mockRejectedValue(networkError)

        const instance = new GetFirstListItem(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Network request failed'
        )
      })

      it('should return record with expanded relations', async () => {
        mockGetFirstListItem.mockResolvedValue({
          id: 'user-1',
          name: 'First User',
          expand: { profile: { id: 'profile-1', bio: 'Hello' } }
        })

        const instance = new GetFirstListItem(mockPb, 'users' as any).expand({
          profile: 'profiles'
        } as any)

        const result = await instance.execute()

        expect(result.expand?.profile).toBeDefined()
        expect(result.expand?.profile.bio).toBe('Hello')
      })

      it('should get latest record with descending sort', async () => {
        mockGetFirstListItem.mockResolvedValue({
          id: 'latest-123',
          name: 'Latest Record',
          created: '2023-12-01'
        })

        const instance = new GetFirstListItem(mockPb, 'users' as any).sort([
          '-created'
        ] as any)

        const result = await instance.execute()

        expect(result.id).toBe('latest-123')
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            sort: '-created'
          })
        )
      })

      it('should get oldest record with ascending sort', async () => {
        mockGetFirstListItem.mockResolvedValue({
          id: 'oldest-001',
          name: 'Oldest Record',
          created: '2020-01-01'
        })

        const instance = new GetFirstListItem(mockPb, 'users' as any).sort([
          'created'
        ] as any)

        const result = await instance.execute()

        expect(result.id).toBe('oldest-001')
        expect(mockGetFirstListItem).toHaveBeenCalledWith(
          'id != ""',
          expect.objectContaining({
            sort: 'created'
          })
        )
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple getFirstListItem calls from same factory', async () => {
        const factory = getFirstListItemFactory(mockPb)

        await factory.collection('users' as any).execute()
        await factory.collection('posts' as any).execute()

        expect(mockGetFirstListItem).toHaveBeenCalledTimes(2)
        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCollection).toHaveBeenCalledWith('posts')
      })

      it('should not share state between instances', async () => {
        const factory = getFirstListItemFactory(mockPb)

        const instance1 = factory
          .collection('users' as any)
          .filter([{ field: 'role', operator: '=', value: 'admin' }] as any)

        const instance2 = factory
          .collection('posts' as any)
          .sort(['-created'] as any)

        await instance1.execute()
        await instance2.execute()

        expect(mockGetFirstListItem).toHaveBeenNthCalledWith(
          1,
          expect.any(String),
          {
            sort: '',
            expand: '',
            fields: ''
          }
        )
        expect(mockGetFirstListItem).toHaveBeenNthCalledWith(2, 'id != ""', {
          sort: '-created',
          expand: '',
          fields: ''
        })
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await getFirstListItemFactory(mockPb)
        .collection('users' as any)
        .filter([{ field: 'active', operator: '=', value: true }] as any)
        .sort(['-created'] as any)
        .execute()

      expect(mockGetFirstListItem).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ sort: '-created' })
      )
      expect(result).toBeDefined()
    })

    it('should support complex chaining with all methods', async () => {
      await getFirstListItemFactory(mockPb)
        .collection('users' as any)
        .filter([
          { field: 'active', operator: '=', value: true },
          { field: 'verified', operator: '=', value: true }
        ] as any)
        .sort(['-priority', '-created'] as any)
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockGetFirstListItem).toHaveBeenCalledWith(expect.any(String), {
        sort: '-priority, -created',
        expand: 'profile, settings',
        fields: 'id, name, email'
      })
    })
  })
})
