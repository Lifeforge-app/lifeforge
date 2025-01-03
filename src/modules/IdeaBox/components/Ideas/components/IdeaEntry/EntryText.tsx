import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import EntryContextMenu from '../EntryContextMenu'

function EntryText({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  setIdeaList
}: {
  entry: IIdeaBoxEntry
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  setIdeaList: React.Dispatch<React.SetStateAction<IIdeaBoxEntry[]>>
}): React.ReactElement {
  const [expanded, setExpanded] = useState(false)
  const { componentBg } = useThemeColors()
  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'IDEA',
      item: {
        id: entry.id,
        type: 'idea'
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
      onClick={() => {
        setExpanded(prev => !prev)
      }}
      ref={node => {
        dragRef(node)
      }}
      className={`group relative my-4 flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 shadow-custom ${componentBg} ${
        isDragging ? 'cursor-move' : ''
      }`}
      style={{
        opacity
      }}
    >
      {entry.pinned && (
        <Icon
          icon="tabler:pin"
          className="absolute -left-2 -top-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
        />
      )}
      <div>
        <p
          className={`${
            !expanded && 'line-clamp-6'
          } !select-text whitespace-pre-wrap`}
        >
          {entry.content}
        </p>
        <span className="text-sm text-bg-500">
          {moment(entry.updated).fromNow()}
        </span>
      </div>
      <EntryContextMenu
        entry={entry}
        setTypeOfModifyIdea={setTypeOfModifyIdea}
        setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
        setExistedData={setExistedData}
        setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
        setIdeaList={setIdeaList}
      />
    </div>
  )
}

export default EntryText
