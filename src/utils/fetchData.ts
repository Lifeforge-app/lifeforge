/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { t } from 'i18next'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import { toCamelCase } from './strings'

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
  successInfo?: string | null | false
  failureInfo?: string | null | false
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

      if (!res.ok) throw new Error(data.message)
      if (successInfo) {
        toast.success(
          t('fetch.success', {
            action: t(`fetch.action.${toCamelCase(successInfo ?? '')}`)
          })
        )
      }

      callback?.(data)
      return data
    })
    .catch(err => {
      if (failureInfo) {
        toast.error(
          t('fetch.failure', {
            action: t(`fetch.action.${toCamelCase(failureInfo ?? '')}`)
          })
        )
      }

      onFailure?.()
      console.error(err)
    })
    .finally(() => {
      finalCallback?.()
    })
}
