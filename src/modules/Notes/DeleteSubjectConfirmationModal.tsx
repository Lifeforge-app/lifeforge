/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type INotesSubject } from './Workspace'
import Modal from '../../components/Modal'

function DeleteSubjectConfirmationModal({
  isOpen,
  closeModal,
  subjectDetails,
  updateSubjectList
}: {
  isOpen: boolean
  closeModal: () => void
  subjectDetails: INotesSubject | null
  updateSubjectList: () => void
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  function deleteFolder(): void {
    if (subjectDetails === null) return

    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_HOST}/notes/subject/delete/${
        subjectDetails.id
      }`,
      {
        method: 'DELETE'
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info("Uhh, hopefully you truly didn't need that folder.")
          closeModal()
          updateSubjectList()
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't delete the folder. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to delete {subjectDetails?.title}?
      </h1>
      <p className="mt-2 text-neutral-500">
        This will delete the subject and all the notes inside it. This action is
        irreversible!
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
          onClick={deleteFolder}
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

export default DeleteSubjectConfirmationModal
