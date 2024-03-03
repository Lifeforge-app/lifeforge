/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import DateGroup from './DateGroup'
import { type IPhotosEntry } from '..'
import { Icon } from '@iconify/react/dist/iconify.js'

function Gallery({ photos }: { photos: IPhotosEntry }): React.ReactElement {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        {Object.entries(photos.items).map(([date, photos]) => (
          <DateGroup
            key={date}
            date={date}
            photos={photos}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            toggleSelectAll={() => {
              if (photos.every(photo => selectedPhotos.includes(photo.id))) {
                setSelectedPhotos(
                  selectedPhotos.filter(
                    photo => !photos.map(photo => photo.id).includes(photo)
                  )
                )
                return
              }
              let _selected = selectedPhotos.slice()
              const _photos = photos.map(photo => photo.id)

              _selected = _selected.filter(photo => !_photos.includes(photo))
              _selected = [..._selected, ..._photos]
              setSelectedPhotos(_selected)
            }}
            isSelectedAll={photos.every(photo =>
              selectedPhotos.includes(photo.id)
            )}
          />
        ))}
      </div>
      <div
        className={`absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-6rem)] -translate-x-1/2 items-center justify-between rounded-t-md bg-bg-50 p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] transition-all dark:bg-bg-900 ${
          selectedPhotos.length === 0 ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedPhotos([])
            }}
          >
            <Icon icon="tabler:x" className="h-5 w-5 text-bg-500" />
          </button>
          <p className="text-lg text-bg-500">
            {selectedPhotos.length} selected
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
            <Icon icon="tabler:share" className="h-5 w-5" />
          </button>
          <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
            <Icon icon="tabler:plus" className="h-5 w-5" />
          </button>
          <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
            <Icon icon="tabler:download" className="h-5 w-5" />
          </button>
          <button className="rounded-md p-2 text-red-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
            <Icon icon="tabler:trash" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Gallery
