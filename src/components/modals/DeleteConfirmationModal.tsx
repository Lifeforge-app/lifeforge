import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import fetchAPI from '@utils/fetchAPI'
import ModalWrapper from './ModalWrapper'
import Button from '../buttons/Button'

function DeleteConfirmationModal({
  itemName,
  isOpen,
  onClose,
  data,
  updateDataList,
  apiEndpoint,
  customTitle,
  customText,
  nameKey,
  customCallback,
  customConfirmButtonIcon,
  customConfirmButtonText,
  customOnClick,
  queryKey,
  multiQueryKey = false
}: {
  itemName?: string
  isOpen: boolean
  onClose: () => void
  data?: any | string[]
  updateDataList?: () => void
  apiEndpoint?: string
  customTitle?: string
  customText?: string
  nameKey?: string
  customCallback?: () => Promise<void>
  customConfirmButtonIcon?: string
  customConfirmButtonText?: string
  customOnClick?: () => Promise<void>
  queryKey?: unknown[] | unknown[][]
  multiQueryKey?: boolean
}): React.ReactElement {
  const { t } = useTranslation('common.modals')
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function deleteData(): Promise<void> {
    if (data === null) return
    setLoading(true)

    await fetchAPI(
      `${apiEndpoint}/${!Array.isArray(data) ? (data?.id ?? '') : ''}`,
      {
        method: 'DELETE',
        body: !Array.isArray(data) ? undefined : { ids: data }
      }
    )

    try {
      onClose()
      if (updateDataList) updateDataList()

      if (customCallback) {
        customCallback()
          .then(() => {
            setLoading(false)
            onClose()
          })
          .catch(console.error)
      }
    } catch {
      toast.error(t('deleteConfirmation.error'))
    } finally {
      if (queryKey) {
        const updateFunc = (old: any[]) => {
          if (!Array.isArray(data)) {
            return old.filter(item => item.id !== data.id)
          }
          return old.filter(item => !data.includes(item.id))
        }

        if (multiQueryKey) {
          ;(queryKey as unknown[][]).forEach(key => {
            queryClient.setQueryData(key, updateFunc)
          })
        } else {
          queryClient.setQueryData(queryKey, updateFunc)
        }
      }
      setLoading(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        {customTitle ??
          t('deleteConfirmation.title', {
            itemName: nameKey
              ? data?.[nameKey]
              : Array.isArray(data)
                ? `${data.length} ${itemName}`
                : `the ${itemName}`
          })}
      </h1>
      <p className="text-bg-500 mt-2">
        {customText ?? t('deleteConfirmation.desc', { itemName })}
      </p>
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
          icon={customConfirmButtonIcon ?? 'tabler:trash'}
          loading={loading}
          onClick={() => {
            if (customOnClick !== undefined) {
              setLoading(true)
              customOnClick().finally(() => setLoading(false))
              return
            }
            deleteData().catch(console.error)
          }}
        >
          {customConfirmButtonText ?? 'Delete'}
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default DeleteConfirmationModal
