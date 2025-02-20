import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import APIRequest from '@utils/fetchData'
import ModalWrapper from './ModalWrapper'
import Button from '../buttons/Button'

function DeleteConfirmationModal({
  itemName,
  isOpen,
  onClose,
  data,
  updateDataLists: updateDataList,
  apiEndpoint,
  customTitle,
  customText,
  nameKey,
  customCallback,
  customConfirmButtonIcon,
  customConfirmButtonText
}: {
  itemName?: string
  isOpen: boolean
  onClose: () => void
  data?: any | string[]
  updateDataLists?: () => void
  apiEndpoint?: string
  customTitle?: string
  customText?: string
  nameKey?: string
  customCallback?: () => Promise<void>
  customConfirmButtonIcon?: string
  customConfirmButtonText?: string
}): React.ReactElement {
  const { t } = useTranslation('common.modals')
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (data === null) return
    setLoading(true)

    await APIRequest({
      endpoint: `${apiEndpoint}/${!Array.isArray(data) ? data?.id ?? '' : ''}`,
      method: 'DELETE',
      successInfo: 'delete',
      failureInfo: 'delete',
      body: !Array.isArray(data) ? undefined : { ids: data },
      callback: () => {
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
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
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
      <p className="mt-2 text-bg-500">
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
