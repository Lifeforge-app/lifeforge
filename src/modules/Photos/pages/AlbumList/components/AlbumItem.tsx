import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IPhotosAlbum } from '@interfaces/photos_interfaces'

import { usePhotosContext } from '../../../../../providers/PhotosProvider'

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
  const { setModifyAlbumModalOpenType, albumTagList } = usePhotosContext()

  return (
    <li
      key={album.id}
      className="relative flex h-min w-full min-w-0 flex-col gap-1 p-4"
    >
      <Link
        className="hover:bg-bg-900/[0.03] dark:hover:bg-bg-100/5 absolute left-0 top-0 size-full rounded-md transition-all duration-100"
        to={`/photos/album/${album.id}`}
      />
      <div className="flex-center bg-bg-200 dark:bg-bg-800/50 pointer-events-none relative mb-2 h-52 rounded-lg shadow-lg">
        {album.cover !== '' ? (
          <img
            alt=""
            className="size-full rounded-md object-cover"
            src={`${import.meta.env.VITE_API_HOST}/media/${
              album.cover
            }?thumb=0x300`}
          />
        ) : (
          <Icon
            className="text-bg-300 dark:text-bg-700 size-20"
            icon="tabler:library-photo"
          />
        )}
      </div>
      <div className="pointer-events-none relative mt-auto w-full min-w-0 pr-8">
        {album.tags.length !== 0 && typeof albumTagList !== 'string' && (
          <div className="flex flex-wrap gap-1">
            {album.tags
              .sort(
                (a, b) =>
                  albumTagList.findIndex(t => t.id === a) -
                  albumTagList.findIndex(t => t.id === b)
              )
              .map(tag => (
                <button
                  key={tag}
                  className="bg-custom-500/20 text-custom-500 shadow-custom hover:bg-bg-300 mb-1 rounded-full px-3 py-1 text-xs uppercase tracking-wider"
                >
                  {albumTagList.find(t => t.id === tag)?.name}
                </button>
              ))}
          </div>
        )}
        <h2 className="truncate text-lg font-semibold">{album.name}</h2>
        <p className="text-bg-500 flex items-center gap-2 text-sm">
          {album.amount?.toLocaleString()} photos
          <Icon className="size-1" icon="tabler:circle-filled" />
          {album.is_public ? 'Public' : 'Private'}
        </p>
      </div>
      <HamburgerMenu className="absolute bottom-6 right-4">
        <MenuItem
          icon="tabler:pencil"
          text="Rename"
          onClick={() => {
            setSelectedAlbum(album)
            setModifyAlbumModalOpenType('rename')
          }}
        />
        <MenuItem
          icon="tabler:tags"
          text="Edit Tags"
          onClick={() => {
            setSelectedAlbum(album)
            setUpdateAlbumTagsModalOpen(true)
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setSelectedAlbum(album)
            setDeleteModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </li>
  )
}

export default AlbumItem
