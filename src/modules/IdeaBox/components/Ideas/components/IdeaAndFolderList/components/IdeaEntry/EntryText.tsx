import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import EntryContextMenu from './components/EntryContextMenu'
import InFolderChip from './components/InFolderChip'
import TagChip from './components/TagChip'

function EntryText({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
  const [expanded, setExpanded] = useState(false)
  const { componentBg } = useThemeColors()
  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'IDEA',
      item: {
        targetId: entry.id,
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
      ref={node => {
        dragRef(node)
      }}
      className={clsx(
        'group shadow-custom relative my-4 flex w-full cursor-pointer items-start justify-between gap-2 rounded-lg p-4 text-left',
        componentBg,
        isDragging && 'cursor-move'
      )}
      style={{
        opacity
      }}
      onClick={() => {
        setExpanded(prev => !prev)
      }}
    >
      {entry.pinned && (
        <Icon
          className="absolute -top-2 -left-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
          icon="tabler:pin"
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
          className={clsx(
            'break-all whitespace-pre-wrap !select-text',
            !expanded && 'line-clamp-6'
          )}
        >
          {entry.content}
        </p>
        <span className="text-bg-500 text-sm">
          {moment(entry.created).fromNow()}
        </span>
        <InFolderChip entry={entry} />
      </div>
      <EntryContextMenu entry={entry} />
    </button>
  )
}

export default EntryText
