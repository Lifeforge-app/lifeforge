/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { type IPhotosAlbum } from '@typedec/Photos'
import { PhotosContext } from '../../../../../providers/PhotosProvider'

function AlbumItem({
  album,
  setSelectedAlbum,
  setDeleteModalOpen,
  setUpdateAlbumTagsModalOpen
}: {
  album: IPhotosAlbum
  setSelectedAlbum: (album: IPhotosAlbum) => void
  setDeleteModalOpen: (open: boolean) => void
  setUpdateAlbumTagsModalOpen: (open: boolean) => void
}): React.ReactElement {
  const { setModifyAlbumModalOpenType, albumTagList } =
    useContext(PhotosContext)

  return (
    <li key={album.id} className="relative flex h-min flex-col gap-1 p-4">
      <Link
        to={`/photos/album/${album.id}`}
        className="absolute left-0 top-0 h-full w-full rounded-md transition-all duration-100 hover:bg-bg-900/[0.03] dark:hover:bg-bg-100/5"
      />
      <div className="flex-center pointer-events-none relative mb-2 flex h-52 rounded-lg bg-bg-200 shadow-lg dark:bg-bg-800/50">
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
        {album.tags.length !== 0 && typeof albumTagList !== 'string' && (
          <div className="flex flex-wrap gap-2">
            {album.tags.map(tag => (
              <button
                key={tag}
                className="mb-1 rounded-full bg-custom-500/20 px-3 py-1 text-xs uppercase tracking-wider text-custom-500 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-300"
              >
                {albumTagList.find(t => t.id === tag)?.name}
              </button>
            ))}
          </div>
        )}
        <h2 className="truncate text-lg font-semibold text-bg-800 dark:text-bg-100">
          {album.name}
        </h2>
        <p className="flex items-center gap-2 text-sm text-bg-500">
          {album.amount?.toLocaleString()} photos
          <Icon icon="tabler:circle-filled" className="h-1 w-1" />
          {album.is_public ? 'Public' : 'Private'}
        </p>
      </div>
      <HamburgerMenu className="absolute bottom-6 right-4">
        <MenuItem
          icon="tabler:pencil"
          onClick={() => {
            setSelectedAlbum(album)
            setModifyAlbumModalOpenType('rename')
          }}
          text="Rename"
        />
        <MenuItem
          icon="tabler:tags"
          onClick={() => {
            setSelectedAlbum(album)
            setUpdateAlbumTagsModalOpen(true)
          }}
          text="Edit Tags"
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
