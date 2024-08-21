import { Icon } from '@iconify/react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { usePhotosContext } from '@providers/PhotosProvider'

function PhotosSidebar(): React.ReactElement {
  const {
    photos,
    albumList,
    setModifyAlbumModalOpenType: setCreateAlbumModalOpen,
    sidebarOpen,
    setSidebarOpen
  } = usePhotosContext()

  const navigate = useNavigate()

  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9990] size-full shrink-0 rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-4rem)] lg:w-1/4`}
    >
      <Scrollbar>
        <div className="flex-between flex px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col">
          <li className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all">
            <Link
              to="/photos"
              onClick={() => {
                setSidebarOpen(false)
              }}
              className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800"
            >
              <Icon icon="tabler:photo" className="size-6 shrink-0" />
              <div className="w-full">All Photos</div>
              <span className="text-sm text-bg-500">
                {photos === 'loading' ? (
                  <Icon icon="svg-spinners:180-ring" className="size-5" />
                ) : photos === 'error' ? (
                  'Error'
                ) : (
                  photos.totalItems.toLocaleString()
                )}
              </span>
            </Link>
          </li>
          <SidebarItem
            icon="tabler:star-filled"
            name="Favourites"
            onClick={() => {
              navigate('/photos/favourites')
              setSidebarOpen(false)
            }}
          />
          <SidebarDivider />
          <SidebarTitle
            name="albums"
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setCreateAlbumModalOpen('create')
            }}
          />
          <APIComponentWithFallback data={albumList}>
            {albumList => (
              <>
                {albumList.length > 0 ? (
                  albumList.slice(0, 5).map(album => (
                    <>
                      <li
                        key={album.id}
                        className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                      >
                        <Link
                          to={`/photos/album/${album.id}`}
                          onClick={() => {
                            setSidebarOpen(false)
                          }}
                          className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 transition-all duration-100 hover:bg-bg-100 dark:hover:bg-bg-800"
                        >
                          <div className="flex-center flex size-10 shrink-0 rounded-md bg-bg-200/50 shadow-sm dark:bg-bg-700/50">
                            {album.cover !== '' ? (
                              <img
                                src={`${import.meta.env.VITE_API_HOST}/media/${
                                  album.cover
                                }?thumb=0x300`}
                                alt=""
                                className="size-full rounded-md object-cover"
                              />
                            ) : (
                              <Icon
                                icon="tabler:library-photo"
                                className="size-5 text-bg-300"
                              />
                            )}
                          </div>
                          <div className="w-full truncate text-bg-500">
                            {album.name}
                          </div>
                          <span className="text-sm text-bg-500">
                            {album.amount?.toLocaleString()}
                          </span>
                        </Link>
                      </li>
                      <li className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all">
                        <Link
                          to="/photos/album"
                          onClick={() => {
                            setSidebarOpen(false)
                          }}
                          className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800"
                        >
                          <div className="flex-center flex size-10 shrink-0">
                            <Icon
                              icon="tabler:arrow-right"
                              className="size-6 text-bg-500"
                            />
                          </div>
                          <div className="w-full text-bg-500">
                            View all albums
                          </div>
                        </Link>
                      </li>
                    </>
                  ))
                ) : (
                  <div className="mx-4">
                    <EmptyStateScreen
                      icon="tabler:books-off"
                      title="No albums yet"
                      description="Create an album to organize your photos."
                      forSidebar
                    />
                  </div>
                )}
              </>
            )}
          </APIComponentWithFallback>
          <SidebarDivider />
          <SidebarItem icon="tabler:archive" name="Archive" />
          <SidebarItem icon="tabler:lock" name="Locked Folder" />
          <SidebarItem
            icon="tabler:trash"
            name="Trash"
            onClick={() => {
              navigate('/photos/trash')
              setSidebarOpen(false)
            }}
          />
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default PhotosSidebar
