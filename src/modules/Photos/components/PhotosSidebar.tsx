import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

function PhotosSidebar() {
  const { t } = useTranslation('modules.photos')
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
      customHeight="xl:h-[calc(100%-2rem)]"
      isOpen={sidebarOpen}
      setOpen={setSidebarOpen}
    >
      <SidebarItem
        active={location.pathname === '/photos'}
        icon="tabler:photo"
        name="All Photos"
        number={typeof photos !== 'string' ? photos.totalItems : 0}
        onClick={() => {
          navigate('/photos')
          setSidebarOpen(false)
        }}
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
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setCreateAlbumModalOpen('create')
        }}
        name="albums"
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
                      className="text-bg-500 relative flex items-center gap-6 px-4 font-medium transition-all"
                    >
                      <Link
                        className="hover:bg-bg-100 dark:hover:bg-bg-800 flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 transition-all duration-100"
                        to={`/photos/album/${album.id}`}
                        onClick={() => {
                          setSidebarOpen(false)
                        }}
                      >
                        <div className="flex-center bg-bg-200/50 dark:bg-bg-700/50 shadow-xs size-10 shrink-0 rounded-md">
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
                              className="text-bg-300 size-5"
                              icon="tabler:library-photo"
                            />
                          )}
                        </div>
                        <div className="text-bg-500 w-full truncate">
                          {album.name}
                        </div>
                        <span className="text-bg-500 text-sm">
                          {album.amount?.toLocaleString()}
                        </span>
                      </Link>
                    </li>
                  </>
                ))}
                <li className="text-bg-500 relative flex items-center gap-6 px-4 font-medium transition-all">
                  <Link
                    className="hover:bg-bg-100 dark:hover:bg-bg-800 flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4"
                    to="/photos/album"
                    onClick={() => {
                      setSidebarOpen(false)
                    }}
                  >
                    <div className="flex-center size-10 shrink-0">
                      <Icon
                        className="text-bg-500 size-6"
                        icon="tabler:arrow-right"
                      />
                    </div>
                    <div className="text-bg-500 w-full">
                      {t('sidebar.photos.viewAllAlbum')}
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <div className="mx-4">
                <EmptyStateScreen
                  smaller
                  icon="tabler:books-off"
                  name="albums"
                  namespace="modules.photos"
                />
              </div>
            )}
          </>
        )}
      </APIFallbackComponent>
      <SidebarDivider />
      <SidebarItem
        autoActive
        icon="tabler:archive"
        name="Archive"
        onClick={() => {}}
      />
      <SidebarItem
        autoActive
        icon="tabler:lock"
        name="Locked Folder"
        onClick={() => {}}
      />
      <SidebarItem
        active={location.pathname === '/photos/trash'}
        icon="tabler:trash"
        name="Trash"
        onClick={() => {
          navigate('/photos/trash')
          setSidebarOpen(false)
        }}
      />
    </SidebarWrapper>
  )
}

export default PhotosSidebar
