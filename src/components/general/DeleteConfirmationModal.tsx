/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'
import Modal from './Modal'

function DeleteConfirmationModal({
  itemName,
  isOpen,
  closeModal,
  data,
  updateDataList,
  apiEndpoint,
  nameKey = 'name'
}: {
  itemName: string
  isOpen: boolean
  closeModal: () => void
  data: any
  updateDataList: () => void
  apiEndpoint: string
  nameKey?: string
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (data === null) return

    setLoading(true)
    fetch(`${import.meta.env.VITE_API_HOST}/${apiEndpoint}/${data.id}`, {
      method: 'DELETE'
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info(`Uhh, hopefully you truly didn't need that ${itemName}.`)
          closeModal()
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
        Are you sure you want to delete {data?.[nameKey] || `the ${itemName}`}?
      </h1>
      <p className="mt-2 text-bg-500">
        This will delete the {itemName} and everything related to it. This
        action is irreversible!
      </p>
      <div className="mt-8 flex w-full justify-around gap-2">
        <button
          onClick={closeModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-bg-700"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={deleteData}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-red-600"
        >
          {loading ? (
            <>
              <span className="small-loader-light"></span>
            </>
          ) : (
            <>
              <Icon icon="tabler:trash" className="h-5 w-5" />
              DELETE
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
