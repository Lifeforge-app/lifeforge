import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import updateFactory, { Update } from './update'

// Mock LoggingService
vi.mock('@functions/logging/loggingService', () => ({
  LoggingService: {
    debug: vi.fn()
  }
}))

describe('Update Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockUpdate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockUpdate = vi
      .fn()
      .mockResolvedValue({ id: 'record-123', name: 'Updated' })
    mockCollection = vi.fn().mockReturnValue({
      update: mockUpdate
    })
    mockPb = {
      collection: mockCollection
    } as unknown as PocketBase

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = updateFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new Update instance when collection is called', () => {
      const factory = updateFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(Update)
    })

    it('should create independent instances for different collections', () => {
      const factory = updateFactory(mockPb)

      const usersInstance = factory.collection('users' as any)
      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('Update class', () => {
    describe('id method', () => {
      it('should set record id and return this for chaining', () => {
        const instance = new Update(mockPb, 'users' as any)

        const result = instance.id('record-123')

        expect(result).toBe(instance)
      })

      it('should correctly store and pass id to PocketBase on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('test-record-id').data({ name: 'Test' })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'test-record-id',
          expect.any(Object),
          expect.any(Object)
        )
      })

      it('should overwrite previously set id and use latest', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('first-id').id('second-id').data({ name: 'Test' })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'second-id',
          expect.any(Object),
          expect.any(Object)
        )
      })
    })

    describe('data method', () => {
      it('should set data and return this for chaining', () => {
        const instance = new Update(mockPb, 'users' as any)

        const result = instance.data({ name: 'Updated User' })

        expect(result).toBe(instance)
      })

      it('should correctly store and pass data to PocketBase on execute', async () => {
        const testData = { name: 'Updated User', email: 'updated@example.com' }
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data(testData)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          testData,
          expect.any(Object)
        )
      })

      it('should accept partial data for updates', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data({ name: 'Only name updated' })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Only name updated' },
          expect.any(Object)
        )
      })

      it('should accept data with nested objects and pass correctly', async () => {
        const nestedData = {
          metadata: { key: 'value', nested: { deep: true } }
        }
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data(nestedData)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          nestedData,
          expect.any(Object)
        )
      })

      it('should accept data with array values and pass correctly', async () => {
        const arrayData = { tags: ['tag1', 'tag2'] }
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data(arrayData)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          arrayData,
          expect.any(Object)
        )
      })

      it('should accept data with null values to clear fields', async () => {
        const nullData = { avatar: null, bio: null }
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data(nullData)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          nullData,
          expect.any(Object)
        )
      })

      it('should accept field append operator (+) and pass correctly', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data({ 'tags+': ['new-tag'] } as any)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { 'tags+': ['new-tag'] },
          expect.any(Object)
        )
      })

      it('should accept field remove operator (-) and pass correctly', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data({ 'tags-': ['old-tag'] } as any)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { 'tags-': ['old-tag'] },
          expect.any(Object)
        )
      })

      it('should accept numeric increment with + operator', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data({ 'score+': 10 } as any)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { 'score+': 10 },
          expect.any(Object)
        )
      })

      it('should accept numeric decrement with - operator', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('record-123').data({ 'score-': 5 } as any)
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { 'score-': 5 },
          expect.any(Object)
        )
      })

      it('should overwrite previously set data and use latest', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance
          .id('record-123')
          .data({ name: 'First' })
          .data({ name: 'Second' })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Second' },
          expect.any(Object)
        )
      })

      it('should handle data with Date objects', async () => {
        const date = new Date('2023-12-01')
        const instance = new Update(mockPb, 'events' as any)

        instance.id('event-123').data({ startDate: date })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'event-123',
          { startDate: date },
          expect.any(Object)
        )
      })

      it('should handle data with boolean values', async () => {
        const instance = new Update(mockPb, 'users' as any)

        instance.id('user-123').data({ active: true, verified: false })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'user-123',
          { active: true, verified: false },
          expect.any(Object)
        )
      })

      it('should handle data with numeric values including zero', async () => {
        const instance = new Update(mockPb, 'products' as any)

        instance.id('product-123').data({ price: 0, discount: 0.5 })
        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'product-123',
          { price: 0, discount: 0.5 },
          expect.any(Object)
        )
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new Update(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(Update)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          {
            expand: '',
            fields: 'id, name'
          }
        )
      })

      it('should handle empty fields object on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .fields({} as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          {
            expand: '',
            fields: ''
          }
        )
      })

      it('should preserve id and data when creating new instance', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('my-id')
          .data({ name: 'Test', email: 'test@test.com' })

        const result = instance.fields({ id: true } as any)
        await result.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'my-id',
          { name: 'Test', email: 'test@test.com' },
          expect.objectContaining({ fields: 'id' })
        )
      })

      it('should handle many fields on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .fields({
            id: true,
            name: true,
            email: true,
            avatar: true,
            created: true,
            updated: true
          } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          expect.objectContaining({
            fields: 'id, name, email, avatar, created, updated'
          })
        )
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new Update(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(Update)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          {
            expand: 'profile',
            fields: ''
          }
        )
      })

      it('should handle empty expand object on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .expand({} as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          {
            expand: '',
            fields: ''
          }
        )
      })

      it('should preserve id and data when expanding', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('test-id')
          .data({ name: 'Test' })
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'test-id',
          { name: 'Test' },
          expect.objectContaining({
            expand: 'profile'
          })
        )
      })

      it('should handle multiple expand relations on execute', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .expand({
            profile: 'profiles',
            settings: 'user_settings',
            organization: 'organizations'
          } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          {
            expand: 'profile, settings, organization',
            fields: ''
          }
        )
      })
    })

    describe('execute method', () => {
      it('should throw error if record id is not set', async () => {
        const instance = new Update(mockPb, 'users' as any)
        instance.data({ name: 'Test' })

        await expect(instance.execute()).rejects.toThrow(
          'Failed to update record in collection "users". Record ID is required. Use .id() method to set the ID.'
        )
      })

      it('should throw error if record id is empty string', async () => {
        const instance = new Update(mockPb, 'users' as any)
        instance.id('').data({ name: 'Test' })

        await expect(instance.execute()).rejects.toThrow(
          'Failed to update record in collection "users". Record ID is required. Use .id() method to set the ID.'
        )
      })

      it('should throw error if data is not set', async () => {
        const instance = new Update(mockPb, 'users' as any)
        instance.id('record-123')

        await expect(instance.execute()).rejects.toThrow(
          'Failed to update record in collection "users". Data is required. Use .data() method to set the data.'
        )
      })

      it('should throw error if data is empty object', async () => {
        const instance = new Update(mockPb, 'users' as any)
        instance.id('record-123').data({})

        await expect(instance.execute()).rejects.toThrow(
          'Failed to update record in collection "users". Data is required. Use .data() method to set the data.'
        )
      })

      it('should throw error with both id and data missing', async () => {
        const instance = new Update(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Record ID is required'
        )
      })

      it('should include collection name in error messages', async () => {
        const instance = new Update(mockPb, 'custom_collection' as any)
        instance.data({ name: 'Test' })

        await expect(instance.execute()).rejects.toThrow(
          'Failed to update record in collection "custom_collection"'
        )
      })

      it('should call PocketBase update with correct parameters', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-to-update')
          .data({ name: 'Updated User', email: 'updated@example.com' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockUpdate).toHaveBeenCalledWith(
          'record-to-update',
          { name: 'Updated User', email: 'updated@example.com' },
          { expand: '', fields: '' }
        )
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new Update(mockPb, 'user__notes' as any)
          .id('note-123')
          .data({ content: 'Updated note' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ from middle of collection name', async () => {
        const instance = new Update(mockPb, 'admin_user__records' as any)
          .id('record-123')
          .data({ content: 'Updated' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__records')
      })

      it('should return the updated record', async () => {
        const mockRecord = { id: 'abc123', name: 'Updated', version: 2 }
        mockUpdate.mockResolvedValue(mockRecord)

        const instance = new Update(mockPb, 'users' as any)
          .id('abc123')
          .data({ name: 'Updated' })

        const result = await instance.execute()

        expect(result).toEqual(mockRecord)
      })

      it('should pass expand and fields options together', async () => {
        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockUpdate).toHaveBeenCalledWith(
          'record-123',
          { name: 'Test' },
          { expand: 'profile', fields: 'id, name' }
        )
      })

      it('should propagate PocketBase 404 errors', async () => {
        const notFoundError = {
          status: 404,
          message: 'The requested resource was not found.'
        }
        mockUpdate.mockRejectedValue(notFoundError)

        const instance = new Update(mockPb, 'users' as any)
          .id('non-existent')
          .data({ name: 'Test' })

        await expect(instance.execute()).rejects.toEqual(notFoundError)
      })

      it('should propagate permission errors', async () => {
        const permissionError = {
          status: 403,
          message: 'You are not allowed to perform this request.'
        }
        mockUpdate.mockRejectedValue(permissionError)

        const instance = new Update(mockPb, 'users' as any)
          .id('restricted-record')
          .data({ name: 'Test' })

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })

      it('should propagate validation errors', async () => {
        const validationError = {
          status: 400,
          message: 'Validation failed',
          data: { email: { code: 'invalid', message: 'Invalid email format' } }
        }
        mockUpdate.mockRejectedValue(validationError)

        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ email: 'invalid-email' })

        await expect(instance.execute()).rejects.toEqual(validationError)
      })

      it('should propagate network errors', async () => {
        const networkError = new Error('Network request failed')
        mockUpdate.mockRejectedValue(networkError)

        const instance = new Update(mockPb, 'users' as any)
          .id('record-123')
          .data({ name: 'Test' })

        await expect(instance.execute()).rejects.toThrow(
          'Network request failed'
        )
      })

      it('should return record with expanded relations', async () => {
        mockUpdate.mockResolvedValue({
          id: 'user-123',
          name: 'Updated User',
          expand: {
            profile: { id: 'profile-123', bio: 'Updated bio' }
          }
        })

        const instance = new Update(mockPb, 'users' as any)
          .id('user-123')
          .data({ name: 'Updated User' })
          .expand({ profile: 'profiles' } as any)

        const result = await instance.execute()

        expect(result.expand?.profile).toBeDefined()
        expect(result.expand?.profile.bio).toBe('Updated bio')
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple updates from same factory', async () => {
        const factory = updateFactory(mockPb)

        await factory
          .collection('users' as any)
          .id('id-1')
          .data({ name: 'Update 1' })
          .execute()
        await factory
          .collection('users' as any)
          .id('id-2')
          .data({ name: 'Update 2' })
          .execute()
        await factory
          .collection('users' as any)
          .id('id-3')
          .data({ name: 'Update 3' })
          .execute()

        expect(mockUpdate).toHaveBeenCalledTimes(3)
        expect(mockUpdate).toHaveBeenNthCalledWith(
          1,
          'id-1',
          { name: 'Update 1' },
          expect.any(Object)
        )
        expect(mockUpdate).toHaveBeenNthCalledWith(
          2,
          'id-2',
          { name: 'Update 2' },
          expect.any(Object)
        )
        expect(mockUpdate).toHaveBeenNthCalledWith(
          3,
          'id-3',
          { name: 'Update 3' },
          expect.any(Object)
        )
      })

      it('should not share state between instances', async () => {
        const factory = updateFactory(mockPb)

        const instance1 = factory
          .collection('users' as any)
          .id('user-id')
          .data({ name: 'User Update' })
        const instance2 = factory
          .collection('posts' as any)
          .id('post-id')
          .data({ title: 'Post Update' })

        await instance1.execute()
        await instance2.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCollection).toHaveBeenCalledWith('posts')
        expect(mockUpdate).toHaveBeenNthCalledWith(
          1,
          'user-id',
          { name: 'User Update' },
          expect.any(Object)
        )
        expect(mockUpdate).toHaveBeenNthCalledWith(
          2,
          'post-id',
          { title: 'Post Update' },
          expect.any(Object)
        )
      })

      it('should handle mixed success and failure', async () => {
        mockUpdate
          .mockResolvedValueOnce({ id: 'id-1', name: 'Updated 1' })
          .mockRejectedValueOnce(new Error('Update failed'))
          .mockResolvedValueOnce({ id: 'id-3', name: 'Updated 3' })

        const factory = updateFactory(mockPb)

        const result1 = await factory
          .collection('users' as any)
          .id('id-1')
          .data({ name: 'Updated 1' })
          .execute()
        expect(result1.name).toBe('Updated 1')

        await expect(
          factory
            .collection('users' as any)
            .id('id-2')
            .data({ name: 'Updated 2' })
            .execute()
        ).rejects.toThrow('Update failed')

        const result3 = await factory
          .collection('users' as any)
          .id('id-3')
          .data({ name: 'Updated 3' })
          .execute()
        expect(result3.name).toBe('Updated 3')
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await updateFactory(mockPb)
        .collection('users' as any)
        .id('chained-id')
        .data({ name: 'Chained Update' })
        .execute()

      expect(mockUpdate).toHaveBeenCalledWith(
        'chained-id',
        { name: 'Chained Update' },
        expect.any(Object)
      )
      expect(result).toBeDefined()
    })

    it('should support complex chaining with all methods', async () => {
      await updateFactory(mockPb)
        .collection('users' as any)
        .id('test-id')
        .data({ name: 'Test', email: 'test@test.com', active: true })
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockUpdate).toHaveBeenCalledWith(
        'test-id',
        { name: 'Test', email: 'test@test.com', active: true },
        { expand: 'profile, settings', fields: 'id, name, email' }
      )
    })

    it('should allow data to be set after id', async () => {
      const instance = updateFactory(mockPb)
        .collection('users' as any)
        .id('my-id')

      instance.data({ name: 'Delayed Data' })
      await instance.execute()

      expect(mockUpdate).toHaveBeenCalledWith(
        'my-id',
        { name: 'Delayed Data' },
        expect.any(Object)
      )
    })
  })
})
