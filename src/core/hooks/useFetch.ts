import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

function useFetch<T>(
  endpoint: string,
  criteriaMet: boolean = true,
  changeStateWhenLoading: boolean = true,
  showError: boolean = true
): [
  data: Loadable<T>,
  refresh: () => void,
  setData: React.Dispatch<React.SetStateAction<Loadable<T>>>
] {
  const [data, setData] = useState<Loadable<T>>('loading')

  async function fetchData() {
    if (changeStateWhenLoading) {
      setData('loading')
    }
    try {
      const data = await fetchAPI<T>(endpoint)
      setData(data)
    } catch (err) {
      setData('error')
      if (showError) {
        toast.error('fetch.fetchError' + ' ' + err)
      }
      console.error(err)
    }
  }

  useEffect(() => {
    if (criteriaMet) {
      fetchData()
    }
  }, [endpoint, criteriaMet])

  return [data, fetchData, setData]
}

export default useFetch
