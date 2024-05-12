/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import React from 'react'
import { type INotesSubject } from '@typedec/Notes'

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
      className="relative flex h-full flex-col flex-center gap-6 rounded-lg border-2 border-dashed border-bg-400 p-8 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20"
    >
      <Icon icon="tabler:folder-plus" className="h-16 w-16 text-bg-500" />
      <div className="text-2xl font-medium tracking-wide text-bg-500">
        Create subject
      </div>
    </button>
  )
}

export default CreateSubjectButton
