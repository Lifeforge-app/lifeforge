import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

function useHashParams(): [
  URLSearchParams,
  (params: Record<string, string> | URLSearchParams) => void
] {
  const { hash } = useLocation()

  const hashParams = useMemo(() => {
    const hashArray = hash
      .replace(/^#/, '')
      .split('&')
      .filter(hash => hash.trim())
    const params = new URLSearchParams()

    hashArray.forEach(hash => {
      try {
        const [key, value] = hash.split('=')
        params.set(key, value)
      } catch {
        throw new Error('Invalid hash')
      }
    })

    return params
  }, [hash])

  const [localHash, setLocalHash] = useState(hashParams)

  const setHashParams = (
    params: Record<string, string> | URLSearchParams
  ): void => {
    const newParams = new URLSearchParams()
    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => {
        newParams.set(key, value)
      })
    } else {
      Object.entries(params).forEach(([key, value]) => {
        newParams.set(key, value)
      })
    }

    setLocalHash(newParams)
  }

  useEffect(() => {
    const hashArray = Array.from(localHash.entries())
      .filter(([key, value]) => Boolean(value) && Boolean(key))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    window.history.pushState({}, '', `#${hashArray}`)
  }, [localHash])

  return [localHash, setHashParams]
}

export default useHashParams
