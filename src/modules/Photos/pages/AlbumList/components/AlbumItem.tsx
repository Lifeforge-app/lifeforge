/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import {
  PhotosContext,
  type IPhotosAlbum
} from '../../../../../providers/PhotosProvider'

function AlbumItem({
  album,
  setSelectedAlbum,
  setDeleteModalOpen
}: {
  album: IPhotosAlbum
  setSelectedAlbum: (album: IPhotosAlbum) => void
  setDeleteModalOpen: (open: boolean) => void
}): React.ReactElement {
  const { setModifyAlbumModalOpenType } = useContext(PhotosContext)

  return (
    <li key={album.id} className="relative flex h-min flex-col gap-1 p-4">
      <Link
        to={`/photos/album/${album.id}`}
        className="absolute left-0 top-0 h-full w-full rounded-md transition-all duration-100 hover:bg-bg-900/[0.03] dark:hover:bg-bg-100/5"
      />
      <div className="pointer-events-none relative mb-2 flex h-52 items-center justify-center rounded-lg bg-bg-200 shadow-lg dark:bg-bg-800/50">
        {album.cover ? (
          <img
            src={`${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
              album.cover
            }?thumb=0x300`}
            alt=""
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <Icon
            icon="tabler:library-photo"
            className="h-20 w-20 text-bg-300 dark:text-bg-700"
          />
        )}
      </div>
      <div className="pointer-events-none relative w-full min-w-0 pr-8">
        <h2 className="truncate text-lg font-semibold text-bg-800 dark:text-bg-100">
          {album.name}
        </h2>
        <p className="flex items-center gap-2 text-sm text-bg-500">
          {album.amount.toLocaleString()} photos
          <Icon icon="tabler:circle-filled" className="h-1 w-1" />
          {album.is_public ? 'Public' : 'Private'}
        </p>
      </div>
      <HamburgerMenu position="absolute bottom-6 right-4">
        <MenuItem
          icon="tabler:pencil"
          onClick={() => {
            setSelectedAlbum(album)
            setModifyAlbumModalOpenType('rename')
          }}
          text="Rename"
        />
        <MenuItem
          icon="tabler:trash"
          onClick={() => {
            setSelectedAlbum(album)
            setDeleteModalOpen(true)
          }}
          text="Delete"
          isRed
        />
      </HamburgerMenu>
    </li>
  )
}

export default AlbumItem
