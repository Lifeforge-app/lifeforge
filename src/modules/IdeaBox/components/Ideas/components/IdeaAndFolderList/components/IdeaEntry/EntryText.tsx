import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import EntryContextMenu from './components/EntryContextMenu'
import TagChip from './components/TagChip'

function EntryText({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
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
    <button
      onClick={() => {
        setExpanded(prev => !prev)
      }}
      ref={node => {
        dragRef(node)
      }}
      className={`group relative my-4 flex w-full cursor-pointer items-start justify-between gap-2 rounded-lg p-4 text-left shadow-custom ${componentBg} ${
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
        {entry.tags !== null && entry.tags?.length !== 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {entry.tags?.map((tag, index) => (
              <TagChip key={index} text={tag} />
            ))}
          </div>
        )}
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
        {typeof entry.folder !== 'string' && (
          <span className="mt-3 flex items-center gap-2 text-sm">
            In
            <span
              style={{
                color: entry.folder.color,
                backgroundColor: entry.folder.color + '30'
              }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 pl-2"
            >
              <Icon icon={entry.folder.icon} className="size-4" />
              {entry.folder.name}
            </span>
          </span>
        )}
      </div>
      <EntryContextMenu entry={entry} />
    </button>
  )
}

export default EntryText
