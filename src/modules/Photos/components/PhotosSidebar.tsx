import { Icon } from '@iconify/react'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { usePhotosContext } from '@providers/PhotosProvider'

function PhotosSidebar(): React.ReactElement {
  const { t } = useTranslation()
  const {
    photos,
    albumList,
    setModifyAlbumModalOpenType: setCreateAlbumModalOpen,
    sidebarOpen,
    setSidebarOpen
  } = usePhotosContext()

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <SidebarWrapper
      isOpen={sidebarOpen}
      setOpen={setSidebarOpen}
      customHeight="xl:h-[calc(100%-2rem)]"
    >
      <SidebarItem
        active={location.pathname === '/photos'}
        icon="tabler:photo"
        name="All Photos"
        onClick={() => {
          navigate('/photos')
          setSidebarOpen(false)
        }}
        number={typeof photos !== 'string' ? photos.totalItems : 0}
      />
      <SidebarItem
        active={location.pathname === '/photos/favourites'}
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
      <APIFallbackComponent data={albumList}>
        {albumList => (
          <>
            {albumList.length > 0 ? (
              <>
                {albumList.slice(0, 5).map(album => (
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
                        <div className="flex-center size-10 shrink-0 rounded-md bg-bg-200/50 shadow-xs dark:bg-bg-700/50">
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
                  </>
                ))}
                <li className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all">
                  <Link
                    to="/photos/album"
                    onClick={() => {
                      setSidebarOpen(false)
                    }}
                    className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800"
                  >
                    <div className="flex-center size-10 shrink-0">
                      <Icon
                        icon="tabler:arrow-right"
                        className="size-6 text-bg-500"
                      />
                    </div>
                    <div className="w-full text-bg-500">
                      {t('sidebar.photos.viewAllAlbum')}
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <div className="mx-4">
                <EmptyStateScreen
                  icon="tabler:books-off"
                  title="No albums yet"
                  description="Create an album to organize your photos."
                  smaller
                />
              </div>
            )}
          </>
        )}
      </APIFallbackComponent>
      <SidebarDivider />
      <SidebarItem
        autoActive
        onClick={() => {}}
        icon="tabler:archive"
        name="Archive"
      />
      <SidebarItem
        autoActive
        onClick={() => {}}
        icon="tabler:lock"
        name="Locked Folder"
      />
      <SidebarItem
        icon="tabler:trash"
        name="Trash"
        active={location.pathname === '/photos/trash'}
        onClick={() => {
          navigate('/photos/trash')
          setSidebarOpen(false)
        }}
      />
    </SidebarWrapper>
  )
}

export default PhotosSidebar
