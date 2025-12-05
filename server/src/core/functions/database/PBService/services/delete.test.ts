import PocketBase from 'pocketbase'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import deleteFactory, { Delete } from './delete'

// Mock LoggingService
vi.mock('@functions/logging/loggingService', () => ({
  LoggingService: {
    debug: vi.fn()
  }
}))

describe('Delete Service', () => {
  let mockPb: PocketBase
  let mockCollection: ReturnType<typeof vi.fn>
  let mockDelete: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockDelete = vi.fn().mockResolvedValue(true)
    mockCollection = vi.fn().mockReturnValue({
      delete: mockDelete
    })
    mockPb = {
      collection: mockCollection
    } as unknown as PocketBase

    vi.clearAllMocks()
  })

  describe('factory function', () => {
    it('should return an object with collection method', () => {
      const factory = deleteFactory(mockPb)

      expect(factory).toHaveProperty('collection')
      expect(typeof factory.collection).toBe('function')
    })

    it('should create a new Delete instance when collection is called', () => {
      const factory = deleteFactory(mockPb)

      const instance = factory.collection('users' as any)

      expect(instance).toBeInstanceOf(Delete)
    })

    it('should create independent instances for different collections', () => {
      const factory = deleteFactory(mockPb)

      const usersInstance = factory.collection('users' as any)

      const postsInstance = factory.collection('posts' as any)

      expect(usersInstance).not.toBe(postsInstance)
    })
  })

  describe('Delete class', () => {
    describe('id method', () => {
      it('should set record id and return this for chaining', () => {
        const instance = new Delete(mockPb, 'users' as any)

        const result = instance.id('record-123')

        expect(result).toBe(instance)
      })

      it('should correctly store and pass id to PocketBase on execute', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        instance.id('test-record-id')
        await instance.execute()

        expect(mockDelete).toHaveBeenCalledWith('test-record-id')
      })

      it('should accept id with special characters and pass correctly', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        instance.id('id_with-special.chars')
        await instance.execute()

        expect(mockDelete).toHaveBeenCalledWith('id_with-special.chars')
      })

      it('should overwrite previously set id and use latest', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        instance.id('first-id')
        instance.id('second-id')
        await instance.execute()

        expect(mockDelete).toHaveBeenCalledWith('second-id')
      })

      it('should accept very long id strings and pass correctly', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        const longId = 'a'.repeat(1000)

        instance.id(longId)
        await instance.execute()

        expect(mockDelete).toHaveBeenCalledWith(longId)
      })
    })

    describe('execute method', () => {
      it('should throw error if record id is not set', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Failed to delete record in collection "users". Record ID is required. Use .id() method to set the ID.'
        )
      })

      it('should throw error if record id is empty string', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        instance.id('')

        await expect(instance.execute()).rejects.toThrow(
          'Failed to delete record in collection "users". Record ID is required. Use .id() method to set the ID.'
        )
      })

      it('should include collection name in error message', async () => {
        const instance = new Delete(mockPb, 'custom_collection' as any)

        await expect(instance.execute()).rejects.toThrow(
          'Failed to delete record in collection "custom_collection"'
        )
      })

      it('should call PocketBase delete with correct record id', async () => {
        const instance = new Delete(mockPb, 'users' as any)

        instance.id('record-to-delete')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('users')
        expect(mockDelete).toHaveBeenCalledWith('record-to-delete')
      })

      it('should strip user__ prefix from collection name', async () => {
        const instance = new Delete(mockPb, 'user__notes' as any)

        instance.id('note-123')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('notes')
      })

      it('should not strip user__ from middle of collection name', async () => {
        const instance = new Delete(mockPb, 'admin_user__logs' as any)

        instance.id('log-123')

        await instance.execute()

        expect(mockCollection).toHaveBeenCalledWith('admin_user__logs')
      })

      it('should return true on successful deletion', async () => {
        mockDelete.mockResolvedValue(true)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('record-123')

        const result = await instance.execute()

        expect(result).toBe(true)
      })

      it('should return false on failed deletion', async () => {
        mockDelete.mockResolvedValue(false)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('record-123')

        const result = await instance.execute()

        expect(result).toBe(false)
      })

      it('should propagate PocketBase errors', async () => {
        const pbError = new Error('Record not found')

        mockDelete.mockRejectedValue(pbError)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('non-existent')

        await expect(instance.execute()).rejects.toThrow('Record not found')
      })

      it('should propagate 404 errors for non-existent records', async () => {
        const notFoundError = {
          status: 404,
          message: 'The requested resource was not found.'
        }

        mockDelete.mockRejectedValue(notFoundError)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('does-not-exist')

        await expect(instance.execute()).rejects.toEqual(notFoundError)
      })

      it('should propagate permission errors', async () => {
        const permissionError = {
          status: 403,
          message: 'You are not allowed to perform this request.'
        }

        mockDelete.mockRejectedValue(permissionError)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('restricted-record')

        await expect(instance.execute()).rejects.toEqual(permissionError)
      })

      it('should handle network errors', async () => {
        const networkError = new Error('Network request failed')

        mockDelete.mockRejectedValue(networkError)

        const instance = new Delete(mockPb, 'users' as any)

        instance.id('record-123')

        await expect(instance.execute()).rejects.toThrow(
          'Network request failed'
        )
      })
    })

    describe('consecutive operations', () => {
      it('should allow multiple deletes from same factory', async () => {
        const factory = deleteFactory(mockPb)

        await factory
          .collection('users' as any)
          .id('id-1')
          .execute()
        await factory
          .collection('users' as any)
          .id('id-2')
          .execute()
        await factory
          .collection('users' as any)
          .id('id-3')
          .execute()

        expect(mockDelete).toHaveBeenCalledTimes(3)
        expect(mockDelete).toHaveBeenNthCalledWith(1, 'id-1')
        expect(mockDelete).toHaveBeenNthCalledWith(2, 'id-2')
        expect(mockDelete).toHaveBeenNthCalledWith(3, 'id-3')
      })

      it('should not share state between instances', async () => {
        const factory = deleteFactory(mockPb)

        const instance1 = factory.collection('users' as any)

        const instance2 = factory.collection('posts' as any)

        instance1.id('user-id')
        instance2.id('post-id')

        await instance1.execute()
        await instance2.execute()

        expect(mockDelete).toHaveBeenNthCalledWith(1, 'user-id')
        expect(mockDelete).toHaveBeenNthCalledWith(2, 'post-id')
      })

      it('should handle mixed success and failure', async () => {
        mockDelete
          .mockResolvedValueOnce(true)
          .mockRejectedValueOnce(new Error('Failed'))
          .mockResolvedValueOnce(true)

        const factory = deleteFactory(mockPb)

        const result1 = await factory
          .collection('users' as any)
          .id('id-1')
          .execute()

        expect(result1).toBe(true)

        await expect(
          factory
            .collection('users' as any)
            .id('id-2')
            .execute()
        ).rejects.toThrow('Failed')

        const result3 = await factory
          .collection('users' as any)
          .id('id-3')
          .execute()

        expect(result3).toBe(true)
      })
    })
  })

  describe('method chaining', () => {
    it('should support full method chain', async () => {
      const result = await deleteFactory(mockPb)
        .collection('users' as any)
        .id('chained-id')
        .execute()

      expect(mockDelete).toHaveBeenCalledWith('chained-id')
      expect(result).toBe(true)
    })

    it('should work with id set after collection', async () => {
      const instance = deleteFactory(mockPb).collection('users' as any)

      instance.id('delayed-id')

      const result = await instance.execute()

      expect(mockDelete).toHaveBeenCalledWith('delayed-id')
      expect(result).toBe(true)
    })
  })
})
