import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useDrag } from 'react-dnd'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import EntryContent from './components/EntryContent'
import EntryContextMenu from '../components/EntryContextMenu'
import InFolderChip from '../components/InFolderChip'
import TagChip from '../components/TagChip'

function EntryLink({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
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
    <div
      ref={node => {
        dragRef(node)
      }}
      className={clsx(
        'group shadow-custom relative my-4 flex flex-col items-start justify-between gap-2 rounded-lg p-4',
        componentBg,
        isDragging && 'cursor-move'
      )}
      style={{
        opacity
      }}
    >
      {entry.pinned && (
        <Icon
          className="absolute -top-2 -left-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
          icon="tabler:pin"
        />
      )}
      <div className="space-y-2">
        {entry.tags !== null && entry.tags?.length !== 0 && (
          <div className="flex gap-2">
            {entry.tags?.map((tag, index) => (
              <TagChip key={index} text={tag} />
            ))}
          </div>
        )}
        {entry.title && (
          <h3 className="text-xl font-semibold">{entry.title}</h3>
        )}
        <EntryContextMenu entry={entry} />
      </div>
      <EntryContent entry={entry} />
      <span className="text-bg-500 text-sm">
        {moment(entry.created).fromNow()}
      </span>
      <InFolderChip entry={entry} />
    </div>
  )
}

export default EntryLink
