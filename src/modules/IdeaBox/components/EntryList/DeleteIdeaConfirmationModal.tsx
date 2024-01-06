/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import Modal from '../../../../components/Modal'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IIdeaBoxEntry } from './Ideas'

function DeleteIdeaConfirmationModal({
  isOpen,
  setData,
  closeModal,
  ideaDetails
}: {
  isOpen: boolean
  setData: React.Dispatch<
    React.SetStateAction<IIdeaBoxEntry[] | 'error' | 'loading'>
  >
  closeModal: () => void
  ideaDetails: IIdeaBoxEntry | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  function deleteIdea(): void {
    if (ideaDetails === null) return

    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_HOST}/idea-box/idea/delete/${ideaDetails.id}`,
      {
        method: 'DELETE'
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info("Uhh, hopefully you truly didn't need that idea.")
          closeModal()
          setData(prev => {
            if (prev === 'error' || prev === 'loading') return prev
            return prev.filter(idea => idea.id !== ideaDetails?.id)
          })
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't delete the idea. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to delete this {ideaDetails?.type} idea?
      </h1>
      <p className="mt-2 text-neutral-500">
        This idea will be gone forever. This action is irreversible!
      </p>
      <div className="mt-8 flex w-full justify-around gap-2">
        <button
          onClick={closeModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 transition-all hover:bg-neutral-700"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={deleteIdea}
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

export default DeleteIdeaConfirmationModal
