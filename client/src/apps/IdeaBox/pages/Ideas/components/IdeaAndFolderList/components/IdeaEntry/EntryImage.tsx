import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'

import { type IIdeaBoxEntry } from '../../../../../../interfaces/ideabox_interfaces'
import CustomZoomContent from './components/CustomZoomContent'
import EntryContextMenu from './components/EntryContextMenu'
import InFolderChip from './components/InFolderChip'
import TagChip from './components/TagChip'

function EntryImage({ entry }: { entry: IIdeaBoxEntry }) {
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

      <h3 className="text-xl font-semibold">{entry.title}</h3>
      <Zoom
        ZoomContent={CustomZoomContent}
        zoomImg={{
          src: `${import.meta.env.VITE_API_HOST}/media/${
            entry.collectionId
          }/${entry.id}/${entry.image}`
        }}
        zoomMargin={40}
      >
        <img
          alt={''}
          className="shadow-custom rounded-lg"
          src={`${import.meta.env.VITE_API_HOST}/media/${
            entry.collectionId
          }/${entry.id}/${entry.image}?thumb=500x0`}
        />
      </Zoom>
      {entry.tags !== null && entry.tags?.length !== 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {entry.tags?.map((tag, index) => (
            <TagChip key={index} text={tag} />
          ))}
        </div>
      )}
      <span className="text-bg-500 block text-sm">
        {dayjs(entry.created).fromNow()}
      </span>
      <InFolderChip entry={entry} />
    </div>
  )
}

export default EntryImage
