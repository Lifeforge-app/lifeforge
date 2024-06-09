import { Icon } from '@iconify/react'
import React from 'react'
import { useDrag } from 'react-dnd'
import Zoom from 'react-medium-image-zoom'
import { type IIdeaBoxEntry } from '@typedec/IdeaBox'
import CustomZoomContent from '../CustomZoomContent'
import EntryContextMenu from '../EntryContextMenu'

function EntryImage({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  updateIdeaList
}: {
  entry: IIdeaBoxEntry
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  updateIdeaList: () => void
}): React.ReactElement {
  const [{ opacity, isDragging }, dragRef] = useDrag(
    () => ({
      type: 'IDEA',
      item: {
        id: entry.id
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
          className="absolute -left-2 -top-2 z-[50] size-5 -rotate-90 text-red-500 drop-shadow-md"
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
      <EntryContextMenu
        entry={entry}
        setTypeOfModifyIdea={setTypeOfModifyIdea}
        setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
        setExistedData={setExistedData}
        setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
        updateIdeaList={updateIdeaList}
      />
    </div>
  )
}

export default EntryImage
