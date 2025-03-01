import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import APIRequestV2 from '@utils/newFetchData'

function useModifyMutation<T>(
  type: 'create' | 'update',
  endpoint: string,
  options?: {
    onSuccess?: (newData: T) => void
    onSettled?: () => void
    onError?: () => void
  }
): UseMutationResult<T, Error, Partial<T>, unknown> {
  return useMutation<T, Error, Partial<T>>({
    mutationFn: async (data: Partial<T>) => {
      if (
        Object.values(data).some(
          value =>
            value instanceof File ||
            (typeof value === 'object' &&
              (value as { image: File | 'string' | null })?.image instanceof
                File)
        )
      ) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value)
          } else if (
            typeof value === 'object' &&
            (value as { image: File | 'string' | null })?.image instanceof File
          ) {
            formData.append(key, (value as { image: File }).image)
          } else if (typeof value !== 'string') {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value)
          }
        })

        return APIRequestV2(endpoint, {
          method: type === 'create' ? 'POST' : 'PATCH',
          body: formData,
          isJSON: false
        })
      }

      Object.keys(data).forEach(key => {
        const value = data[key as keyof typeof data]

        if (
          typeof value === 'object' &&
          Object.keys(value ?? {}).includes('image')
        ) {
          if (
            typeof (value as { image: File | 'string' | null }).image ===
            'string'
          ) {
            // @ts-expect-error - ignore this for now lol
            data[key as keyof typeof data] = (
              value as { image: File | 'string' | null }
            ).image
          } else if (!(value as { image: File | 'string' | null }).image) {
            delete data[key as keyof typeof data]
          }
        }
      })

      return APIRequestV2(endpoint, {
        method: type === 'create' ? 'POST' : 'PATCH',
        body: data
      })
    },
    onSuccess: (newData: T) => {
      toast.success(
        `Successfully ${type === 'create' ? 'created' : 'updated'}!`
      )
      options?.onSuccess?.(newData)
    },
    onSettled: () => {
      options?.onSettled?.()
    },
    onError: () => {
      toast.error(`Failed to ${type === 'create' ? 'create' : 'update'}`)
      options?.onError?.()
    }
  })
}

export type ModifyMutationResult<T> = UseMutationResult<
  T,
  Error,
  Partial<T>,
  unknown
>

export default useModifyMutation
