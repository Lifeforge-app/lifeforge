import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI, useAPIEndpoint } from 'shared/lib'

import Button from '../../buttons/Button'
import { TextInput } from '../../inputs'

function DeleteConfirmationModal<
  T extends {
    id: string
    [key: string]: unknown
  }
>({
  onClose,
  data: {
    itemName,
    data,
    apiEndpoint,
    apiQueries,
    customTitle,
    customText,
    nameKey,
    afterDelete,
    customConfirmButtonIcon,
    customConfirmButtonText,
    customOnClick,
    queryKey,
    queryUpdateType = 'mutate',
    multiQueryKey = false,
    confirmationText = ''
  }
}: {
  onClose: () => void
  data: {
    itemName?: string
    data?: T | T[]
    apiEndpoint?: string
    apiQueries?: Record<string, string>
    customTitle?: string
    customText?: string
    nameKey?: keyof T
    afterDelete?: () => Promise<void>
    customConfirmButtonIcon?: string
    customConfirmButtonText?: string
    customOnClick?: (close: () => void) => Promise<void>
    queryKey?: unknown[] | unknown[][]
    queryUpdateType?: 'mutate' | 'invalidate'
    multiQueryKey?: boolean
    confirmationText?: string
  }
}) {
  const apiHost = useAPIEndpoint()

  const { t } = useTranslation('common.modals')

  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const [confirmationTextState, setConfirmationTextState] = useState('')

  const finalItemName = useMemo(() => {
    if (Array.isArray(data)) {
      return `${data.length} ${itemName}`
    }

    if (nameKey) {
      return data?.[nameKey]
    }

    return `the ${itemName}`
  }, [data, itemName, nameKey])

  const updateFunc = useCallback(
    (old: T[]) => {
      if (!Array.isArray(data)) {
        return old.filter(item => item.id !== data!.id)
      }

      return old.filter(item => !data.some(d => d.id === item.id))
    },
    [data]
  )

  const mutateData = useCallback(() => {
    if (!data || !queryKey) return

    if (multiQueryKey) {
      ;(queryKey as unknown[][]).forEach(key => {
        if (queryUpdateType === 'mutate') {
          queryClient.setQueryData(key, updateFunc)
        }

        if (queryUpdateType === 'invalidate') {
          queryClient.invalidateQueries({ queryKey: key })
        }
      })
    } else {
      if (queryUpdateType === 'mutate') {
        queryClient.setQueryData(queryKey as unknown[], updateFunc)
      }

      if (queryUpdateType === 'invalidate') {
        queryClient.invalidateQueries({ queryKey: queryKey as unknown[] })
      }
    }
  }, [data, queryKey, queryUpdateType, multiQueryKey, updateFunc])

  async function deleteData(): Promise<void> {
    if (data === null) return
    setLoading(true)

    try {
      await fetchAPI(
        apiHost,
        `${apiEndpoint}/${!Array.isArray(data) ? (data?.id ?? '') : ''}${apiQueries ? `?${new URLSearchParams(apiQueries).toString()}` : ''}`,
        {
          method: 'DELETE',
          body: !Array.isArray(data) ? undefined : { ids: data }
        }
      )

      if (queryKey) mutateData()
      await afterDelete?.()
      onClose()
    } catch {
      toast.error(t('deleteConfirmation.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-w-[40vw]">
      <h1 className="text-2xl font-semibold">
        {customTitle ??
          t('deleteConfirmation.title', {
            itemName: finalItemName
          })}
      </h1>
      <p className="text-bg-500 mt-2">
        {customText ?? t('deleteConfirmation.desc', { itemName })}
      </p>
      {confirmationText && (
        <TextInput
          darker
          className="mt-4"
          icon="tabler:alert-triangle"
          name="Confirmation"
          namespace="common.modals"
          placeholder={t('deleteConfirmation.inputs.confirmation.placeholder', {
            text: confirmationText
          })}
          setValue={setConfirmationTextState}
          tKey="deleteConfirmation"
          value={confirmationTextState}
        />
      )}
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button
          className="w-full"
          icon=""
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          isRed
          className="w-full"
          disabled={
            confirmationText !== '' &&
            confirmationText !== confirmationTextState
          }
          icon={customConfirmButtonIcon ?? 'tabler:trash'}
          loading={loading}
          onClick={() => {
            if (customOnClick !== undefined) {
              setLoading(true)
              customOnClick(onClose).finally(() => setLoading(false))

              return
            }
            deleteData().catch(console.error)
          }}
        >
          {customConfirmButtonText ?? 'Delete'}
        </Button>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
