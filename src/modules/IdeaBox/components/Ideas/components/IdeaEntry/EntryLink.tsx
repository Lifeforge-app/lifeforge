import { Icon } from '@iconify/react'
import React from 'react'
import { useDrag } from 'react-dnd'
import { type IIdeaBoxEntry } from '@typedec/IdeaBox'
import EntryContextMenu from '../EntryContextMenu'

function EntryLink({
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
  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'IDEA',
      item: {
        id: entry.id
      },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: !!monitor.isDragging()
      })
    }),
    []
  )

  return (
    <div
      ref={node => {
        dragRef(node)
      }}
      className={`group relative my-4 flex flex-col items-start justify-between gap-2 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900 ${
        isDragging ? 'cursor-move' : ''
      }`}
      style={{
        opacity
      }}
    >
      {entry.pinned && (
        <Icon
          icon="tabler:pin"
          className="absolute -left-2 -top-2 z-[50] size-5 -rotate-90 text-red-500 drop-shadow-md"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-semibold ">{entry.title}</h3>
        <EntryContextMenu
          entry={entry}
          setTypeOfModifyIdea={setTypeOfModifyIdea}
          setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
          setExistedData={setExistedData}
          setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
          updateIdeaList={updateIdeaList}
        />
      </div>
      <a
        target="_blank"
        rel="noreferrer"
        href={entry.content}
        className="break-all text-custom-500 underline underline-offset-2"
      >
        {entry.content}
      </a>
    </div>
  )
}

export default EntryLink
