import { cookieParse } from 'pocketbase'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function useFetch<T>(
  endpoint: string,
  criteriaMet: boolean = true,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: Record<string, unknown> = {},
  changeStateWhenLoading: boolean = true,
  showError: boolean = true
): [
  data: T | 'loading' | 'error',
  refresh: () => void,
  setData: React.Dispatch<React.SetStateAction<T | 'loading' | 'error'>>
] {
  const { t } = useTranslation()
  const [data, setData] = useState<T | 'loading' | 'error'>('loading')

  function fetchData(): void {
    if (changeStateWhenLoading) {
      setData('loading')
    }
    fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`, {
      method,
      body: method === 'POST' ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        try {
          const data = await res.json()
          if (!res.ok || data.state !== 'success') {
            throw new Error(JSON.stringify(data.message))
          }
          setData(data.data)
        } catch (err) {
          throw new Error(err as string)
        }
      })
      .catch(err => {
        setData('error')
        if (showError) {
          toast.error(t('fetch.fetchError') + ' ' + err)
        }
        console.error(err)
      })
  }

  useEffect(() => {
    if (criteriaMet) {
      fetchData()
    }
  }, [endpoint, criteriaMet])

  return [data, fetchData, setData]
}

export default useFetch
