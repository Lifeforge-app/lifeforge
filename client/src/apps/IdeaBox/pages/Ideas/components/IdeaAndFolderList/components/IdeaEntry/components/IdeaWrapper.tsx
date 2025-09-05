import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ItemWrapper } from 'lifeforge-ui'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'

import type { IdeaBoxIdea } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import EntryContextMenu from './EntryContextMenu'
import InFolderChip from './InFolderChip'
import TagChip from './TagChip'

function IdeaWrapper({
  entry,
  children,
  onClick
}: {
  entry: IdeaBoxIdea
  children: React.ReactNode
  onClick?: () => void
}) {
  const { t } = useTranslation('apps.ideaBox')

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
    <ItemWrapper
      ref={node => {
        dragRef(node)
      }}
      isInteractive
      as="button"
      className={clsx(
        'group my-4 flex w-full! cursor-pointer items-start justify-between gap-2 text-left',
        isDragging && 'cursor-move'
      )}
      style={{
        opacity
      }}
      onClick={onClick}
    >
      {entry.pinned && (
        <Icon
          className="absolute -top-2 -left-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
          icon="tabler:pin"
        />
      )}
      <div className="w-full min-w-0 space-y-3">
        <div className="flex-between">
          <div className="text-bg-400 dark:text-bg-600 flex items-center gap-2">
            <Icon
              className="size-5"
              icon={
                {
                  text: 'tabler:article',
                  link: 'tabler:link',
                  image: 'tabler:photo'
                }[entry.type] || 'tabler:article'
              }
            />
            <h3 className="font-medium">{t(`entryType.${entry.type}`)}</h3>
          </div>
          <EntryContextMenu entry={entry} />
        </div>
        {children}
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
        {entry.type === 'text' && <InFolderChip entry={entry} />}
      </div>
    </ItemWrapper>
  )
}

export default IdeaWrapper
