import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useDrag } from 'react-dnd'
import Zoom from 'react-medium-image-zoom'
import useThemeColors from '@hooks/useThemeColor'
import {
  type IIdeaBoxTag,
  type IIdeaBoxEntry
} from '@interfaces/ideabox_interfaces'
import CustomZoomContent from '../CustomZoomContent'
import EntryContextMenu from '../EntryContextMenu'
import TagChip from '../TagChip'

function EntryImage({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  setIdeaList,
  selectedTags,
  tags
}: {
  entry: IIdeaBoxEntry
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  setIdeaList: React.Dispatch<React.SetStateAction<IIdeaBoxEntry[]>>
  selectedTags: string[]
  tags: IIdeaBoxTag[] | 'loading' | 'error'
}): React.ReactElement {
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
      className={`group relative my-4 flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 shadow-custom ${componentBg} ${
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
      <div className="space-y-2">
        {entry.tags?.length !== 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {entry.tags?.map((tag, index) => (
              <TagChip
                key={index}
                text={tag}
                active={selectedTags.includes(tag)}
                metadata={
                  typeof tags !== 'string'
                    ? tags.find(t => t.name === tag)
                    : undefined
                }
              />
            ))}
          </div>
        )}
        <h3 className="text-xl font-semibold ">{entry.title}</h3>
        <Zoom
          zoomMargin={40}
          ZoomContent={CustomZoomContent}
          zoomImg={{
            src: `${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.image}`
          }}
        >
          <img
            src={`${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.image}?thumb=500x0`}
            alt={''}
            className="rounded-lg shadow-custom"
          />
        </Zoom>
        <span className="block text-sm text-bg-500">
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
      <EntryContextMenu
        entry={entry}
        setTypeOfModifyIdea={setTypeOfModifyIdea}
        setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
        setExistedData={setExistedData}
        setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
        setIdeaList={setIdeaList}
      />
    </div>
  )
}

export default EntryImage
