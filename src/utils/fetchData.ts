import { t } from 'i18next'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import { toCamelCase } from './strings'

function getRequestBody(body: any, isJSON: boolean): any {
  return isJSON ? JSON.stringify(body) : body
}

export default async function APIRequest({
  endpoint,
  method,
  body,
  callback,
  finalCallback,
  successInfo,
  failureInfo,
  onFailure,
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
  timeout?: number
}): Promise<any> {
  const isJSON = !(
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob
  )

  await fetch(`${import.meta.env.VITE_API_HOST}/${endpoint}`, {
    method,
    signal: AbortSignal.timeout(timeout),
    headers: {
      Authorization: cookieParse(document.cookie).token
        ? `Bearer ${cookieParse(document.cookie).token}`
        : '',
      ...(isJSON ? { 'Content-Type': 'application/json' } : {})
    },
    body: body !== undefined ? getRequestBody(body, isJSON) : null
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
