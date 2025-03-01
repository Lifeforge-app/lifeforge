import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useDrag } from 'react-dnd'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import EntryContent from './components/EntryContent'
import EntryContextMenu from '../components/EntryContextMenu'
import TagChip from '../components/TagChip'

function EntryLink({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
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
      ref={node => {
        dragRef(node)
      }}
      className={clsx(
        'group relative my-4 flex flex-col items-start justify-between gap-2 rounded-lg p-4 shadow-custom',
        componentBg,
        isDragging && 'cursor-move'
      )}
      style={{
        opacity
      }}
    >
      {entry.pinned && (
        <Icon
          className="absolute -left-2 -top-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
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
        <h3 className="text-xl font-semibold ">{entry.title}</h3>
        <span className="text-sm text-bg-500">
          {moment(entry.updated).fromNow()}
        </span>
        {typeof entry.folder !== 'string' && (
          <span className="mt-3 flex items-center gap-2 text-sm">
            In
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 pl-2"
              style={{
                color: entry.folder.color,
                backgroundColor: entry.folder.color + '30'
              }}
            >
              <Icon className="size-4" icon={entry.folder.icon} />
              {entry.folder.name}
            </span>
          </span>
        )}
        <EntryContextMenu entry={entry} />
      </div>
      <EntryContent entry={entry} />
    </div>
  )
}

export default EntryLink
