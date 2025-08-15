import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'

import type { IdeaBoxIdea } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import EntryContextMenu from './components/EntryContextMenu'
import InFolderChip from './components/InFolderChip'
import TagChip from './components/TagChip'

function EntryText({ entry }: { entry: IdeaBoxIdea }) {
  const { t } = useTranslation('apps.ideaBox')

  const [expanded, setExpanded] = useState(false)

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

  if (entry.type !== 'text') {
    return null
  }

  return (
    <button
      ref={node => {
        dragRef(node)
      }}
      className={clsx(
        'shadow-custom group component-bg relative my-4 flex w-full cursor-pointer items-start justify-between gap-2 rounded-lg p-4 text-left',
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
      <div className="w-full min-w-0 space-y-4">
        <div className="flex-between">
          <div className="text-bg-400 dark:text-bg-600 flex items-center gap-2">
            <Icon className="size-5" icon="tabler:text-size" />
            <h3 className="font-medium">{t('entryType.text')}</h3>
          </div>
          <EntryContextMenu entry={entry} />
        </div>
        {!expanded ? (
          <p className="line-clamp-6 w-full min-w-0 overflow-hidden break-all whitespace-pre-wrap !select-text">
            {entry.content}
          </p>
        ) : (
          <div className="prose flex flex-col break-all whitespace-pre-wrap">
            <Markdown>{entry.content}</Markdown>
          </div>
        )}
        {entry.tags !== null && entry.tags?.length !== 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags?.map((tag: string, index: number) => (
              <TagChip key={index} text={tag} />
            ))}
          </div>
        )}
        <div className="text-bg-500 text-sm">
          {dayjs(entry.created).fromNow()}
        </div>
        <InFolderChip entry={entry} />
      </div>
    </button>
  )
}

export default EntryText
