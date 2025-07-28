import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'

import type { IdeaBoxIdea } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import CustomZoomContent from './components/CustomZoomContent'
import EntryContextMenu from './components/EntryContextMenu'
import TagChip from './components/TagChip'

function EntryImage({ entry }: { entry: IdeaBoxIdea }) {
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

  if (entry.type !== 'image') {
    return null
  }

  return (
    <div
      ref={node => {
        dragRef(node)
      }}
      className={clsx(
        'shadow-custom group component-bg relative my-4 cursor-pointer space-y-4 rounded-lg p-4',
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
      <div className="flex-between w-full">
        <div className="text-bg-400 dark:text-bg-600 flex items-center gap-2">
          <Icon className="size-5" icon="tabler:link" />
          <h3 className="font-medium">{t('entryType.image')}</h3>
        </div>
        <EntryContextMenu entry={entry} />
      </div>

      <Zoom
        ZoomContent={CustomZoomContent}
        zoomImg={{
          src: forgeAPI.media.input({
            collectionId: entry.child.collectionId,
            recordId: entry.child.id,
            fieldId: entry.image
          }).endpoint
        }}
        zoomMargin={40}
      >
        <img
          alt={''}
          className="shadow-custom rounded-lg"
          src={
            forgeAPI.media.input({
              collectionId: entry.child.collectionId,
              recordId: entry.child.id,
              fieldId: entry.image
            }).endpoint
          }
        />
      </Zoom>
      {entry.tags !== null && entry.tags?.length !== 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {entry.tags?.map((tag: string, index: number) => (
            <TagChip key={index} text={tag} />
          ))}
        </div>
      )}
      <span className="text-bg-500 block text-sm">
        {dayjs(entry.created).fromNow()}
      </span>
      {/* <InFolderChip entry={entry} /> */}
    </div>
  )
}

export default EntryImage
