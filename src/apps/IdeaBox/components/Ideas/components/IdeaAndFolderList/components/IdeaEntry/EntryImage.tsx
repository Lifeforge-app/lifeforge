import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useDrag } from 'react-dnd'
import Zoom from 'react-medium-image-zoom'

import useComponentBg from '@hooks/useComponentBg'

import { type IIdeaBoxEntry } from '../../../../../../interfaces/ideabox_interfaces'
import CustomZoomContent from './components/CustomZoomContent'
import EntryContextMenu from './components/EntryContextMenu'
import InFolderChip from './components/InFolderChip'
import TagChip from './components/TagChip'

function EntryImage({ entry }: { entry: IIdeaBoxEntry }) {
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
        'shadow-custom group relative my-4 flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4',
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
          <div className="mb-2 flex flex-wrap gap-1">
            {entry.tags?.map((tag, index) => (
              <TagChip key={index} text={tag} />
            ))}
          </div>
        )}
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
        <span className="text-bg-500 block text-sm">
          {dayjs(entry.created).fromNow()}
        </span>
        <InFolderChip entry={entry} />
      </div>
      <EntryContextMenu entry={entry} />
    </div>
  )
}

export default EntryImage
