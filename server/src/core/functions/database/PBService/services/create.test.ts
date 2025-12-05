import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import createFactory, { Create } from './create'

// Mock LoggingService
vi.mock('@functions/logging/loggingService', () => ({
  LoggingService: {
    debug: vi.fn()
  }
}))

describe('Create Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockCreate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCreate = vi
      .fn()
      .mockResolvedValue({ id: 'new-record-id', name: 'Test' })
    mockCollection = vi.fn().mockReturnValue({
      create: mockCreate
    })
    mockPb = {
      collection: mockCollection
    } as unknown as PocketBase

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = createFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new Create instance when collection is called', () => {
      const factory = createFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(Create)
    })

    it('should allow multiple collection calls with different collections', () => {
      const factory = createFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).toBeInstanceOf(Create)
      expect(postsInstance).toBeInstanceOf(Create)
      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('Create class', () => {
    describe('data method', () => {
      it('should set data and return this for chaining', () => {
        const instance = new Create(mockPb, 'users' as any)

        const result = instance.data({ name: 'Test User' })

        expect(result).toBe(instance)
      })

      it('should correctly store and pass data to PocketBase on execute', async () => {
        const testData = { name: 'Test User', email: 'test@example.com' }

        const instance = new Create(mockPb, 'users' as any)

        instance.data(testData)
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(testData, expect.any(Object))
      })

      it('should accept data with nested objects and pass correctly', async () => {
        const nestedData = {
          name: 'Test',
          metadata: { key: 'value', nested: { deep: true } }
        }

        const instance = new Create(mockPb, 'users' as any)

        instance.data(nestedData)
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(nestedData, expect.any(Object))
      })

      it('should accept data with array values and pass correctly', async () => {
        const arrayData = { tags: ['tag1', 'tag2'], roles: [] }

        const instance = new Create(mockPb, 'users' as any)

        instance.data(arrayData)
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(arrayData, expect.any(Object))
      })

      it('should accept data with null and undefined values', async () => {
        const nullData = { nullField: null, undefinedField: undefined }

        const instance = new Create(mockPb, 'users' as any)

        instance.data(nullData)
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(nullData, expect.any(Object))
      })

      it('should accept data with special characters', async () => {
        const specialData = {
          name: 'Test <script>alert("xss")</script>',
          emoji: '🎉',
          unicode: '\u0000\u001f'
        }

        const instance = new Create(mockPb, 'users' as any)

        instance.data(specialData)
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(specialData, expect.any(Object))
      })

      it('should overwrite previously set data', async () => {
        const instance = new Create(mockPb, 'users' as any)

        instance.data({ name: 'First' })
        instance.data({ name: 'Second' })
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Second' },
          expect.any(Object)
        )
      })

      it('should handle data with Date objects', async () => {
        const date = new Date('2023-01-01')

        const instance = new Create(mockPb, 'events' as any)

        instance.data({ startDate: date })
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { startDate: date },
          expect.any(Object)
        )
      })

      it('should handle data with boolean values', async () => {
        const instance = new Create(mockPb, 'users' as any)

        instance.data({ active: true, verified: false })
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { active: true, verified: false },
          expect.any(Object)
        )
      })

      it('should handle data with numeric values including zero', async () => {
        const instance = new Create(mockPb, 'products' as any)

        instance.data({ price: 0, quantity: 100, rating: 4.5 })
        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { price: 0, quantity: 100, rating: 4.5 },
          expect.any(Object)
        )
      })
    })

    describe('fields method', () => {
      it('should return a new instance with fields set', () => {
        const instance = new Create(mockPb, 'users' as any)

        const result = instance.fields({ id: true, name: true } as any)

        expect(result).toBeInstanceOf(Create)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply fields on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({ fields: 'id, name' })
        )
      })

      it('should handle empty fields object on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .fields({} as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({ fields: '' })
        )
      })

      it('should handle multiple fields on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .fields({
            id: true,
            name: true,
            email: true,
            created: true,
            updated: true
          } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({
            fields: 'id, name, email, created, updated'
          })
        )
      })

      it('should preserve data when creating new instance with fields', async () => {
        const instance = new Create(mockPb, 'users' as any)

        instance.data({ name: 'Test', email: 'test@test.com' })

        const result = instance.fields({ id: true } as any)

        await result.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test', email: 'test@test.com' },
          expect.objectContaining({ fields: 'id' })
        )
      })
    })

    describe('expand method', () => {
      it('should return a new instance with expand config set', () => {
        const instance = new Create(mockPb, 'users' as any)

        const result = instance.expand({ profile: 'profiles' } as any)

        expect(result).toBeInstanceOf(Create)
        expect(result).not.toBe(instance)
      })

      it('should correctly apply expand on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({ expand: 'profile' })
        )
      })

      it('should handle empty expand object on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .expand({} as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({ expand: '' })
        )
      })

      it('should handle multiple expand relations on execute', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .expand({
            profile: 'profiles',
            settings: 'user_settings',
            organization: 'organizations'
          } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          expect.objectContaining({ expand: 'profile, settings, organization' })
        )
      })

      it('should preserve data when expanding', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test', bio: 'Hello' })
          .expand({ profile: 'profiles' } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test', bio: 'Hello' },
          expect.objectContaining({ expand: 'profile' })
        )
      })
    })

    describe('execute method', () => {
      it('should throw error if data is not set', async () => {
        const instance = new Create(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Data is required. Use .data() method to set the data.'
        )
      })

      it('should throw error if data is empty object', async () => {
        const instance = new Create(mockPb, 'users' as any)

        instance.data({})

        await expect(instance.execute()).rejects.toThrow(
          'Data is required. Use .data() method to set the data.'
        )
      })

      it('should call PocketBase create with correct parameters', async () => {
        const instance = new Create(mockPb, 'users' as any)

        instance.data({ name: 'Test User', email: 'test@example.com' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test User', email: 'test@example.com' },
          { expand: '', fields: '', requestKey: null }
        )
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new Create(mockPb, 'user__notes' as any)

        instance.data({ content: 'Test note' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ if not at the beginning', async () => {
        const instance = new Create(mockPb, 'admin_user__logs' as any)

        instance.data({ content: 'Test' })

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__logs')
      })

      it('should return the created record', async () => {
        const mockRecord = { id: 'abc123', name: 'Created' }

        mockCreate.mockResolvedValue(mockRecord)

        const instance = new Create(mockPb, 'users' as any)

        instance.data({ name: 'Created' })

        const result = await instance.execute()

        expect(result).toEqual(mockRecord)
      })

      it('should pass expand and fields options together', async () => {
        const instance = new Create(mockPb, 'users' as any)
          .data({ name: 'Test' })
          .expand({ profile: 'profiles' } as any)
          .fields({ id: true, name: true } as any)

        await instance.execute()

        expect(mockCreate).toHaveBeenCalledWith(
          { name: 'Test' },
          { expand: 'profile', fields: 'id, name', requestKey: null }
        )
      })

      it('should propagate PocketBase errors', async () => {
        const pbError = new Error('PocketBase connection failed')

        mockCreate.mockRejectedValue(pbError)

        const instance = new Create(mockPb, 'users' as any)

        instance.data({ name: 'Test' })

        await expect(instance.execute()).rejects.toThrow(
          'PocketBase connection failed'
        )
      })

      it('should handle validation errors from PocketBase', async () => {
        const validationError = {
          message: 'Validation failed',
          data: { email: { code: 'invalid', message: 'Invalid email format' } }
        }

        mockCreate.mockRejectedValue(validationError)

        const instance = new Create(mockPb, 'users' as any)

        instance.data({ email: 'invalid' })

        await expect(instance.execute()).rejects.toEqual(validationError)
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple creates on same factory', async () => {
        const factory = createFactory(mockPb)

        const result1 = await factory
          .collection('users' as any)
          .data({ name: 'User 1' })
          .execute()

        const result2 = await factory
          .collection('users' as any)
          .data({ name: 'User 2' })
          .execute()

        expect(mockCreate).toHaveBeenCalledTimes(2)
        expect(mockCreate).toHaveBeenNthCalledWith(
          1,
          { name: 'User 1' },
          expect.any(Object)
        )
        expect(mockCreate).toHaveBeenNthCalledWith(
          2,
          { name: 'User 2' },
          expect.any(Object)
        )
        expect(result1).toBeDefined()
        expect(result2).toBeDefined()
      })

      it('should not share state between instances', async () => {
        const factory = createFactory(mockPb)

        const instance1 = factory
          .collection('users' as any)
          .data({ name: 'User 1' })

        const instance2 = factory
          .collection('posts' as any)
          .data({ title: 'Post 1' })

        await instance1.execute()
        await instance2.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockCollection).toHaveBeenCalledWith('posts')
        expect(mockCreate).toHaveBeenNthCalledWith(
          1,
          { name: 'User 1' },
          expect.any(Object)
        )
        expect(mockCreate).toHaveBeenNthCalledWith(
          2,
          { title: 'Post 1' },
          expect.any(Object)
        )
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const instance = createFactory(mockPb)
        .collection('users' as any)
        .data({ name: 'Chained User' })

      expect(instance).toBeInstanceOf(Create)

      await instance.execute()

      expect(mockCreate).toHaveBeenCalledWith(
        { name: 'Chained User' },
        expect.any(Object)
      )
    })

    it('should support complex chaining with all methods', async () => {
      await createFactory(mockPb)
        .collection('users' as any)
        .data({ name: 'Test', email: 'test@test.com' })
        .expand({ profile: 'profiles', settings: 'user_settings' } as any)
        .fields({ id: true, name: true, email: true } as any)
        .execute()

      expect(mockCreate).toHaveBeenCalledWith(
        { name: 'Test', email: 'test@test.com' },
        {
          expand: 'profile, settings',
          fields: 'id, name, email',
          requestKey: null
        }
      )
    })
  })
})
