/* eslint-disable @typescript-eslint/no-floating-promises */
import type Client from 'pocketbase'
import { useEffect, useRef, useState } from 'react'
import Pocketbase from 'pocketbase'

export default function usePocketbase(): {
  pocketbase: any
  data: any
  error: any
  loading: boolean
} {
  const [state, setState] = useState<{
    data: any
    error: any
    loading: boolean
  }>({
    data: null,
    error: null,
    loading: true
  })

  const pocketbase = useRef<Client>()

  useEffect(() => {
    ;(async () => {
      setState(s => ({ ...s, loading: true }))
      try {
        pocketbase.current = new Pocketbase(
          import.meta.env.VITE_POCKETBASE_ENDPOINT as string
        )
        setState(s => ({ ...s, loading: false }))
      } catch (error) {
        setState(s => ({ ...s, error, loading: false }))
      }
    })()
  }, [])

  return { pocketbase: pocketbase.current, ...state }
}
