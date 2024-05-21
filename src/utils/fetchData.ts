import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'

export default async function APIRequest({
  endpoint,
  method,
  body,
  callback,
  finalCallback,
  successInfo,
  failureInfo,
  onFailure,
  isJSON = true
}: {
  endpoint: string
  method: string
  body?: any
  callback?: (data: any) => void
  finalCallback?: () => void
  successInfo?: string
  failureInfo?: string
  onFailure?: () => void
  isJSON?: boolean
}): Promise<any> {
  fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${cookieParse(document.cookie).token}`,
      ...(isJSON ? { 'Content-Type': 'application/json' } : {})
    },
    body: body !== undefined ? (isJSON ? JSON.stringify(body) : body) : null
  })
    .then(async res => {
      const data = await res.json()
      if (res.ok) {
        if (successInfo !== undefined) toast.success(successInfo)
        if (callback !== undefined) callback(data)
        return data
      } else {
        throw new Error(data.message)
      }
    })
    .catch(err => {
      if (failureInfo !== undefined) toast.error(failureInfo)
      if (onFailure !== undefined) onFailure()
      console.error(err)
    })
    .finally(() => {
      if (finalCallback !== undefined) finalCallback()
    })
}
