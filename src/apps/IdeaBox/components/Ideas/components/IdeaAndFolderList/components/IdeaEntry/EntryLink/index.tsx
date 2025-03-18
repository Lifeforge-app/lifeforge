import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import { useDrag } from 'react-dnd'

import useComponentBg from '@hooks/useComponentBg'

import { type IIdeaBoxEntry } from '../../../../../../../interfaces/ideabox_interfaces'
import EntryContextMenu from '../components/EntryContextMenu'
import InFolderChip from '../components/InFolderChip'
import TagChip from '../components/TagChip'
import EntryContent from './components/EntryContent'

function EntryLink({ entry }: { entry: IIdeaBoxEntry }) {
  const { componentBg } = useComponentBg()

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
        'shadow-custom group relative my-4 flex flex-col items-start justify-between gap-2 rounded-lg p-4',
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
        {entry.title && (
          <h3 className="text-xl font-semibold">{entry.title}</h3>
        )}
        <EntryContextMenu entry={entry} />
      </div>
      <EntryContent key={entry.content} entry={entry} />
      <span className="text-bg-500 text-sm">
        {moment(entry.created).fromNow()}
      </span>
      <InFolderChip entry={entry} />
    </div>
  )
}

export default EntryLink
