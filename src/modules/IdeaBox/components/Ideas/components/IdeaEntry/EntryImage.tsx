import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { useDrag } from 'react-dnd'
import Zoom from 'react-medium-image-zoom'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import CustomZoomContent from '../CustomZoomContent'
import EntryContextMenu from '../EntryContextMenu'

function EntryImage({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  setIdeaList
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
}): React.ReactElement {
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
      className={`group relative ${isDragging ? 'cursor-move' : ''}`}
      style={{ opacity }}
    >
      {entry.pinned && (
        <Icon
          icon="tabler:pin"
          className="absolute -left-2 -top-2 z-50 size-5 -rotate-90 text-red-500 drop-shadow-md"
        />
      )}
      <Zoom
        zoomMargin={40}
        ZoomContent={CustomZoomContent}
        zoomImg={{
          src: `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
            entry.id
          }/${entry.image}`
        }}
      >
        <img
          src={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
            entry.id
          }/${entry.image}?thumb=500x0`}
          alt={''}
          className="my-4 rounded-lg shadow-custom"
        />
      </Zoom>
      <div className="pointer-events-none absolute left-0 top-0 z-[9999] flex size-full items-end rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_90%)] p-3 text-sm opacity-0 transition-all group-hover:opacity-100">
        {moment(entry.updated).fromNow()}
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
