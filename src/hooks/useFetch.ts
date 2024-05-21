/* eslint-disable @typescript-eslint/member-delimiter-style */
import { cookieParse } from 'pocketbase'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

function useFetch<T>(
  endpoint: string,
  criteriaMet: boolean = true,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  changeStateWhenLoading: boolean = true,
  showError: boolean = true
): [
  data: T | 'loading' | 'error',
  refresh: () => void,
  setData: React.Dispatch<React.SetStateAction<T | 'loading' | 'error'>>
] {
  const [data, setData] = useState<T | 'loading' | 'error'>('loading')

  function fetchData(): void {
    if (changeStateWhenLoading) {
      setData('loading')
    }
    fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        try {
          const data = await res.json()
          if (!res.ok || data.state !== 'success') {
            throw new Error(data.message)
          }
          setData(data.data)
        } catch (err) {
          throw new Error(err as string)
        }
      })
      .catch(err => {
        setData('error')
        if (showError) {
          toast.error(`Failed to fetch data from server. ${err.message}`)
        }
        console.error(err)
      })
  }

  useMemo(() => {
    if (criteriaMet) {
      fetchData()
    }
  }, [endpoint, criteriaMet])

  return [data, fetchData, setData]
}

export default useFetch
