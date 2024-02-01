/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { type INotesSubject } from './SubjectItem'

function CreateSubjectButton({
  setModifySubjectModalOpenType,
  setExistedData
}: {
  setModifySubjectModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<INotesSubject | null>>
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        setModifySubjectModalOpenType('create')
        setExistedData(null)
      }}
      className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-400 p-8 hover:bg-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/20"
    >
      <Icon icon="tabler:folder-plus" className="h-16 w-16 text-neutral-500" />
      <div className="text-2xl font-medium tracking-wide text-neutral-500">
        Create subject
      </div>
    </button>
  )
}

export default CreateSubjectButton
