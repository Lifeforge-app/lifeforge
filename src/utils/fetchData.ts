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
  isJSON = true,
  timeout = 30000
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
  timeout?: number
}): Promise<any> {
  await fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`, {
    method,
    signal: AbortSignal.timeout(timeout),
    headers: {
      Authorization: cookieParse(document.cookie).token
        ? `Bearer ${cookieParse(document.cookie).token}`
        : '',
      ...(isJSON ? { 'Content-Type': 'application/json' } : {})
    },
    body: body !== undefined ? (isJSON ? JSON.stringify(body) : body) : null
  })
    .then(async res => {
      if (!res.ok) {
        try {
          const data = await res.json().catch(() => {
            throw new Error("Couldn't perform API request")
          })
          throw new Error(data.message)
        } catch (err: any) {
          throw new Error(err.message)
        }
      }

      if (successInfo) {
        toast.success(
          successInfo === 'NASFilesReady'
            ? t('fetch.action.NASFilesReady')
            : t('fetch.success', {
                action: t(`fetch.action.${toCamelCase(successInfo ?? '')}`)
              })
        )
      }

      if (res.status === 204) {
        callback?.({})
        return
      }

      const data = await res.json()
      callback?.(data)
      return data
    })
    .catch(err => {
      if (failureInfo) {
        toast.error(
          `${t('fetch.failure', {
            action: t(`fetch.action.${toCamelCase(failureInfo ?? '')}`)
          })} Reason: ${err.message}`
        )
      }

      onFailure?.()
      console.error(err)
    })
    .finally(() => {
      finalCallback?.()
    })
}
