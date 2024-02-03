/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function useFetch<T>(
  endpoint: string,
  criteriaMet: boolean = true
): [
  data: T | 'loading' | 'error',
  refresh: () => void,
  setData: React.Dispatch<React.SetStateAction<T | 'loading' | 'error'>>
] {
  const [data, setData] = useState<T | 'loading' | 'error'>('loading')

  function fetchData(): void {
    setData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`)
      .then(async res => await res.json())
      .then(data => {
        if (data.state !== 'success') {
          throw new Error(data.message)
        }
        setData(data.data)
      })
      .catch(err => {
        setData('error')
        toast.error(
          'Failed to fetch data from the server. Please try again later.'
        )
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
