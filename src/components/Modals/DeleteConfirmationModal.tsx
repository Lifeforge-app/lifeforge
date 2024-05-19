/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
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
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (data === null) return
    if (customCallback) {
      customCallback()
      return
    }

    setLoading(true)
    fetch(`${import.meta.env.VITE_API_HOST}/${apiEndpoint}/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info(`Uhh, hopefully you truly didn't need that ${itemName}.`)
          onClose()
          updateDataList()
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't delete the ${itemName}. Please try again.`)
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
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
          onClick={deleteData}
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
