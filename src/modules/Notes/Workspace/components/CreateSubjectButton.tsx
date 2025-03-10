import { Icon } from '@iconify/react'
import React from 'react'
import { type INotesSubject } from '@interfaces/notes_interfaces'

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
      className="flex-center border-bg-400 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20 relative h-full flex-col gap-6 rounded-lg border-2 border-dashed p-8"
      onClick={() => {
        setModifySubjectModalOpenType('create')
        setExistedData(null)
      }}
    >
      <Icon className="text-bg-500 size-16" icon="tabler:folder-plus" />
      <div className="text-bg-500 text-2xl font-medium tracking-wide">
        Create subject
      </div>
    </button>
  )
}

export default CreateSubjectButton
