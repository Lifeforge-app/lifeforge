/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type IIdeaBoxEntry } from '../Ideas'
import CustomZoomContent from '../CustomZoomContent'
import EntryContextMenu from '../EntryContextMenu'
import Zoom from 'react-medium-image-zoom'
import { Icon } from '@iconify/react/dist/iconify.js'

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
  return (
    <div className="group relative">
      {entry.pinned && (
        <Icon
          icon="tabler:pin"
          className="absolute -left-2 -top-2 z-[50] h-5 w-5 -rotate-90 text-red-500 drop-shadow-md"
        />
      )}
      <Zoom zoomMargin={40} ZoomContent={CustomZoomContent}>
        <img
          src={`${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
            entry.collectionId
          }/${entry.id}/${entry.image}`}
          alt={''}
          className="my-4 rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]"
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
