import { Icon } from '@iconify/react'
import React, { useContext } from 'react'
import { PhotosContext } from '@providers/PhotosProvider'

function AlbumListHeader(): React.ReactElement {
  const { albumList, setModifyAlbumModalOpenType } = useContext(PhotosContext)

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
        Albums{' '}
        <span className="text-base text-bg-500">
          ({typeof albumList !== 'string' ? albumList.length : '...'})
        </span>
      </h1>
      <button
        onClick={() => {
          setModifyAlbumModalOpenType('create')
        }}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800"
      >
        <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
        <span className="shrink-0">create</span>
      </button>
    </header>
  )
}

export default AlbumListHeader
