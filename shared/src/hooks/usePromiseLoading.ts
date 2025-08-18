/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'

export default function usePromiseLoading<T extends any[]>(
  callback: (...args: T) => Promise<any>,
  onError?: (error: unknown) => void
): [boolean, (...args: T) => Promise<void>] {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = useCallback(
    async (...args: T) => {
      setIsLoading(true)

      try {
        await callback(...args)
      } catch (error) {
        console.error('Error during confirmation:', error)
        onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [callback, onError]
  )

  return [isLoading, onClick]
}
