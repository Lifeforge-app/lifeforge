/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import Modal from '../../../components/Modal'
import { type IIdeaBoxContainer } from '..'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'

function DeleteContainerConfirmationModal({
  isOpen,
  closeModal,
  containerDetails,
  updateContainerList
}: {
  isOpen: boolean
  closeModal: () => void
  containerDetails: IIdeaBoxContainer | null
  updateContainerList: () => void
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  function deleteContainer(): void {
    if (containerDetails === null) return

    setLoading(true)
    fetch(
      `http://localhost:3636/idea-box/container/delete/${containerDetails.id}`,
      {
        method: 'DELETE'
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.success('Yay! Container deleted successfully.')
          closeModal()
          updateContainerList()
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't delete the container. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-bold">
        Are you sure you want to delete {containerDetails?.name}?
      </h1>
      <p className="mt-2 text-neutral-500">
        This will delete the container and all the ideas inside it. This action
        is irreversible!
      </p>
      <div className="mt-8 flex w-full justify-around gap-2">
        <button
          onClick={closeModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 transition-all hover:bg-neutral-700"
        >
          Cancel
        </button>
        <button
          onClick={deleteContainer}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 transition-all hover:bg-red-600"
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

export default DeleteContainerConfirmationModal
