/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import EntryContextMenu from '../EntryContextMenu'
import { type IIdeaBoxEntry } from '../Ideas'

function EntryText({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  updateIdeaList
}: {
  entry: IIdeaBoxEntry
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  updateIdeaList: () => void
}): React.ReactElement {
  return (
    <div className="group relative my-4 flex items-start justify-between gap-2 rounded-lg bg-neutral-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      {entry.pinned && (
        <Icon
          icon="tabler:pin"
          className="absolute -left-2 -top-2 z-[50] h-5 w-5 -rotate-90 text-red-500 drop-shadow-md"
        />
      )}
      <p className="mt-1.5 text-neutral-800 dark:text-neutral-100">
        {entry.content}
      </p>
      <EntryContextMenu
        entry={entry}
        setTypeOfModifyIdea={setTypeOfModifyIdea}
        setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
        setExistedData={setExistedData}
        setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
        updateIdeaList={updateIdeaList}
      />
    </div>
  )
}

export default EntryText
