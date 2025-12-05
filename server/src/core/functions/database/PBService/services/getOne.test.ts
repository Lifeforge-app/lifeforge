import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import getOneFactory, { GetOne } from './getOne'

// Mock LoggingService
vi.mock('@functions/logging/loggingService', () => ({
  LoggingService: {
    debug: vi.fn()
  }
}))

describe('GetOne Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockGetOne: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetOne = vi.fn().mockResolvedValue({ id: 'record-123', name: 'Test' })
    mockCollection = vi.fn().mockReturnValue({
      getOne: mockGetOne
    })
    mockPb = {
      collection: mockCollection
    } as unknown as PocketBase

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = getOneFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new GetOne instance when collection is called', () => {
      const factory = getOneFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(GetOne)
    })

    it('should create independent instances for different collections', () => {
      const factory = getOneFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('GetOne class', () => {
    describe('id method', () => {
      it('should set item id and return this for chaining', () => {
        const instance = new GetOne(mockPb, 'users' as any)

        const result = instance.id('item-123')

        expect(result).toBe(instance)
      })

      it('should correctly store and pass id to PocketBase on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('test-record-id')
        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith(
          'test-record-id',
          expect.any(Object)
        )
      })

      it('should accept id with special characters and pass correctly', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('abc123_xyz-456')
        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith(
          'abc123_xyz-456',
          expect.any(Object)
        )
      })

      it('should overwrite previously set id and use latest', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('first-id')
        instance.id('second-id')
        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('second-id', expect.any(Object))
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new GetOne(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(GetOne)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: '',
          fields: 'id, name'
        })
      })

      it('should handle empty fields object on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .fields({} as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: '',
          fields: ''
        })
      })

      it('should handle multiple fields on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .fields({
            id: true,
            name: true,
            email: true,
            avatar: true,
            created: true,
            updated: true
          } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: '',
          fields: 'id, name, email, avatar, created, updated'
        })
      })

      it('should preserve item id when creating new instance', async () => {
        const instance = new GetOne(mockPb, 'users' as any).id('my-id')

        const result = instance.fields({ id: true } as any)

        await result.execute()

        expect(mockGetOne).toHaveBeenCalledWith(
          'my-id',
          expect.objectContaining({ fields: 'id' })
        )
      })

      it('should preserve expand when adding fields', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('test-id')
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('test-id', {
          expand: 'profile',
          fields: 'id'
        })
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new GetOne(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(GetOne)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: 'profile',
          fields: ''
        })
      })

      it('should handle empty expand object on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .expand({} as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: '',
          fields: ''
        })
      })

      it('should handle multiple expand relations on execute', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .expand({
            profile: 'profiles',
            settings: 'user_settings',
            posts: 'posts',
            comments: 'comments'
          } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: 'profile, settings, posts, comments',
          fields: ''
        })
      })

      it('should preserve id when expanding', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('test-id')
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('test-id', expect.any(Object))
      })
    })

    describe('execute method', () => {
      it('should throw error if item id is not set', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Failed to retrieve record in collection "users". Item ID is required. Use .id() method to set the ID.'
        )
      })

      it('should throw error if item id is empty string', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('')

        await expect(instance.execute()).rejects.toThrow(
          'Failed to retrieve record in collection "users". Item ID is required. Use .id() method to set the ID.'
        )
      })

      it('should include collection name in error message', async () => {
        const instance = new GetOne(mockPb, 'custom_records' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Failed to retrieve record in collection "custom_records"'
        )
      })

      it('should call PocketBase getOne with correct parameters', async () => {
        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('record-to-get')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockGetOne).toHaveBeenCalledWith('record-to-get', {
          expand: '',
          fields: ''
        })
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new GetOne(mockPb, 'user__notes' as any)

        instance.id('note-123')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ from middle of collection name', async () => {
        const instance = new GetOne(mockPb, 'admin_user__records' as any)

        instance.id('record-123')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__records')
      })

      it('should return the fetched record', async () => {
        const mockRecord = {
          id: 'abc123',
          name: 'Fetched',
          email: 'test@test.com'
        }

        mockGetOne.mockResolvedValue(mockRecord)

        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('abc123')

        const result = await instance.execute()

        expect(result).toEqual(mockRecord)
      })

      it('should pass expand and fields options together', async () => {
        const instance = new GetOne(mockPb, 'users' as any)
          .id('record-123')
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockGetOne).toHaveBeenCalledWith('record-123', {
          expand: 'profile',
          fields: 'id, name'
        })
      })

      it('should propagate PocketBase 404 errors', async () => {
        const notFoundError = {
          status: 404,
          message: 'The requested resource was not found.'
        }

        mockGetOne.mockRejectedValue(notFoundError)

        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('non-existent')

        await expect(instance.execute()).rejects.toEqual(notFoundError)
      })

      it('should propagate permission errors', async () => {
        const permissionError = {
          status: 403,
          message: 'You are not allowed to perform this request.'
        }

        mockGetOne.mockRejectedValue(permissionError)

        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('restricted-record')

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })

      it('should propagate network errors', async () => {
        const networkError = new Error('Network request failed')

        mockGetOne.mockRejectedValue(networkError)

        const instance = new GetOne(mockPb, 'users' as any)

        instance.id('record-123')

        await expect(instance.execute()).rejects.toThrow(
          'Network request failed'
        )
      })

      it('should return record with expanded relations', async () => {
        const expandedRecord = {
          id: 'user-123',
          name: 'Test User',
          expand: {
            profile: { id: 'profile-123', bio: 'Hello' }
          }
        }

        mockGetOne.mockResolvedValue(expandedRecord)

        const instance = new GetOne(mockPb, 'users' as any)
          .id('user-123')
          .expand({ profile: 'profiles' } as any)

        const result = await instance.execute()

        expect(result).toEqual(expandedRecord)
        expect(result.expand?.profile).toBeDefined()
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple gets from same factory', async () => {
        const factory = getOneFactory(mockPb)

        await factory
          .collection('users' as any)
          .id('id-1')
          .execute()
        await factory
          .collection('users' as any)
          .id('id-2')
          .execute()

        expect(mockGetOne).toHaveBeenCalledTimes(2)
        expect(mockGetOne).toHaveBeenNthCalledWith(
          1,
          'id-1',
          expect.any(Object)
        )
        expect(mockGetOne).toHaveBeenNthCalledWith(
          2,
          'id-2',
          expect.any(Object)
        )
      })

      it('should not share state between instances', async () => {
        const factory = getOneFactory(mockPb)

        const instance1 = factory.collection('users' as any).id('user-id')

        const instance2 = factory.collection('posts' as any).id('post-id')

        await instance1.execute()
        await instance2.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCollection).toHaveBeenCalledWith('posts')
        expect(mockGetOne).toHaveBeenNthCalledWith(
          1,
          'user-id',
          expect.any(Object)
        )
        expect(mockGetOne).toHaveBeenNthCalledWith(
          2,
          'post-id',
          expect.any(Object)
        )
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await getOneFactory(mockPb)
        .collection('users' as any)
        .id('chained-id')
        .execute()

      expect(mockGetOne).toHaveBeenCalledWith('chained-id', {
        expand: '',
        fields: ''
      })
      expect(result).toBeDefined()
    })

    it('should support complex chaining with all methods', async () => {
      await getOneFactory(mockPb)
        .collection('users' as any)
        .id('test-id')
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockGetOne).toHaveBeenCalledWith('test-id', {
        expand: 'profile, settings',
        fields: 'id, name, email'
      })
    })
  })
})
