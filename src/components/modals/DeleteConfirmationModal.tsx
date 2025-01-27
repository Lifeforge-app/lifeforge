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
  customText,
  nameKey,
  customCallback
}: {
  itemName?: string
  isOpen: boolean
  onClose: () => void
  data?: any
  updateDataLists?: () => void
  apiEndpoint?: string
  customText?: string
  nameKey?: string
  customCallback?: () => Promise<void>
}): React.ReactElement {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (data === null) return
    setLoading(true)

    await APIRequest({
      endpoint: `${apiEndpoint}/${data?.id ?? ''}`,
      method: 'DELETE',
      successInfo: 'delete',
      failureInfo: 'delete',
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
        {t('modals.deleteConfirmation.title', {
          itemName: nameKey ? data?.[nameKey] : `the ${itemName}`
        })}
      </h1>
      <p className="mt-2 text-bg-500">
        {customText ?? t('modals.deleteConfirmation.desc', { itemName })}
      </p>
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button
          onClick={onClose}
          icon=""
          variant="secondary"
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
          icon="tabler:trash"
          className="w-full"
          isRed
        >
          Delete
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default DeleteConfirmationModal
