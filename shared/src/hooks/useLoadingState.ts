import { useCallback, useState } from 'react'

export default function usePromiseLoading(
  callback: () => Promise<void>,
  onError?: (error: unknown) => void
): [boolean, () => Promise<void>] {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = useCallback(async () => {
    setIsLoading(true)

    try {
      await callback()
    } catch (error) {
      console.error('Error during confirmation:', error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [callback, onError])

  return [isLoading, onClick]
}
