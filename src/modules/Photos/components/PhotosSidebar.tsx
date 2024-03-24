/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext } from 'react'
import SidebarItem from '../../../components/Sidebar/components/SidebarItem'
import SidebarDivider from '../../../components/Sidebar/components/SidebarDivider'
import SidebarTitle from '../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react/dist/iconify.js'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import { Link } from 'react-router-dom'
import { PhotosContext } from '../../../providers/PhotosProvider'

function PhotosSidebar(): React.ReactElement {
  const {
    photos,
    albumList,
    setModifyAlbumModalOpenType: setCreateAlbumModalOpen
  } = useContext(PhotosContext)

  return (
    <aside className="hidden h-[calc(100%-2rem)] w-80 shrink-0 overflow-hidden overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900 lg:block">
      <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
        <li className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all">
          <Link
            to="/photos"
            className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:photo" className="h-6 w-6 shrink-0" />
            <div className="w-full">All Photos</div>
            <span className="text-sm text-bg-500">
              {photos === 'loading' ? (
                <Icon icon="svg-spinners:180-ring" className="h-5 w-5" />
              ) : photos === 'error' ? (
                'Error'
              ) : (
                photos.totalItems.toLocaleString()
              )}
            </span>
          </Link>
        </li>
        <SidebarItem icon="tabler:star-filled" name="Favorites" />
        <SidebarDivider />
        <SidebarTitle
          name="albums"
          actionButtonIcon="tabler:plus"
          actionButtonOnClick={() => {
            setCreateAlbumModalOpen('create')
          }}
        />
        <APIComponentWithFallback data={albumList}>
          {typeof albumList !== 'string' &&
            albumList.slice(0, 5).map(album => (
              <li
                key={album.id}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <Link
                  to={`/photos/album/${album.id}`}
                  className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 transition-all duration-100 hover:bg-bg-100 dark:hover:bg-bg-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-200/50 shadow-sm dark:bg-bg-700/50">
                    {album.cover !== '' ? (
                      <img
                        src={`${
                          import.meta.env.VITE_POCKETBASE_ENDPOINT
                        }/api/files/${album.cover}?thumb=0x300`}
                        alt=""
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <Icon
                        icon="tabler:library-photo"
                        className="h-5 w-5 text-bg-300"
                      />
                    )}
                  </div>
                  <div className="w-full truncate text-bg-500">
                    {album.name}
                  </div>
                  <span className="text-sm text-bg-500">
                    {album.amount.toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          <li className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all">
            <Link
              to="/photos/album"
              className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon
                  icon="tabler:arrow-right"
                  className="h-6 w-6 text-bg-500"
                />
              </div>
              <div className="w-full text-bg-500">View all albums</div>
            </Link>
          </li>
        </APIComponentWithFallback>
        <SidebarDivider />
        <SidebarItem icon="tabler:archive" name="Archive" />
        <SidebarItem icon="tabler:lock" name="Locked Folder" />
        <SidebarItem icon="tabler:trash" name="Trash" />
      </ul>
    </aside>
  )
}

export default PhotosSidebar
