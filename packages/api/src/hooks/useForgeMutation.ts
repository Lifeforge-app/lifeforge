import {
  type QueryKey,
  type UseMutationResult,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import type { ForgeEndpoint } from '../core'
import type { InferRawInput, InferRawOutput } from '../typescript'

let _errorHandler: ((message: string) => void) | null = null

export function setForgeMutationErrorHandler(
  handler: (message: string) => void
) {
  _errorHandler = handler
}

interface UseForgeMutationOptions {
  action: string
  queryKey?: QueryKey | QueryKey[]
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useForgeMutation<T extends { __isForgeContract: true }>(
  endpoint: ForgeEndpoint<T>,
  options: UseForgeMutationOptions
): UseMutationResult<InferRawOutput<T>, Error, InferRawInput<T>['body']> {
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation(['common.fetch'])

  const actionFormatted =
    'exists' in i18n && i18n.exists(`common.fetch:action.${options.action}`)
      ? t(`common.fetch:action.${options.action}`)
      : options.action

  return useMutation(
    endpoint.mutationOptions({
      onSuccess: () => {
        if (Array.isArray(options.queryKey?.[0])) {
          for (const key of options.queryKey as QueryKey[]) {
            queryClient.invalidateQueries({ queryKey: key })
          }
        } else if (options.queryKey) {
          queryClient.invalidateQueries({
            queryKey: options.queryKey as QueryKey
          })
        }
        options.onSuccess?.()
      },
      onError: error => {
        console.error(`[useForgeMutation] ${options.action} failed:`, error)

        if (options.onError) {
          options.onError(error)
        } else {
          _errorHandler?.(
            t('common.fetch:failure', {
              action: actionFormatted
            })
          )
        }
      }
    })
  )
}
