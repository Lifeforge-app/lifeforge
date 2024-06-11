/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import APIRequest from '@utils/fetchData'
import Modal from './Modal'
import Button from '../ButtonsAndInputs/Button'

function DeleteConfirmationModal({
  itemName,
  isOpen,
  onClose,
  data,
  updateDataList,
  apiEndpoint,
  customText,
  nameKey,
  customCallback
}: {
  itemName: string
  isOpen: boolean
  onClose: () => void
  data: any
  updateDataList: () => void
  apiEndpoint: string
  customText?: string
  nameKey?: string
  customCallback?: () => void
}): React.ReactElement {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (data === null) return
    if (customCallback) {
      customCallback()
      return
    }

    setLoading(true)
    await APIRequest({
      endpoint: `${apiEndpoint}/${data.id}`,
      method: 'DELETE',
      successInfo: 'delete',
      failureInfo: 'delete',
      callback: () => {
        onClose()
        updateDataList()
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        {t('modals.deleteConfirmation.title', {
          itemName: nameKey ? data?.[nameKey] : `the ${itemName}`
        })}
      </h1>
      <p className="mt-2 text-bg-500">
        {customText ?? t('modals.deleteConfirmation.desc', { itemName })}
      </p>
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button onClick={onClose} icon="" type="secondary" className="w-full">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
          icon={loading ? 'svg-spinners:180-ring' : 'tabler:trash'}
          className="w-full"
          isRed
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
