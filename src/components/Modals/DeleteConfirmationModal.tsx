/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useState } from 'react'
import Modal from './Modal'
import APIRequest from '../../utils/fetchData'
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
      successInfo: `Uhh, hopefully you truly didn't need that ${itemName}.`,
      failureInfo: `Oops! Couldn't delete the ${itemName}. Please try again.`,
      callback: () => {
        onClose()
        updateDataList()
      }
    })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to delete{' '}
        {nameKey ? data?.[nameKey] : `the ${itemName}`}?
      </h1>
      <p className="mt-2 text-bg-500">
        {customText ?? (
          <>
            This will delete the {itemName} and everything related to it. This
            action is irreversible!
          </>
        )}
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
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
