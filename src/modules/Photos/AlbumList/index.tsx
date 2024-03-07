import React, { useContext, useState } from 'react'
import ModuleWrapper from '../../../components/general/ModuleWrapper'
import ModuleHeader from '../../../components/general/ModuleHeader'
import PhotosSidebar from '../PhotosSidebar'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IPhotosAlbum, PhotosContext } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import CreateAlbumModal from '../MainGallery/CreateAlbumModal'
import HamburgerMenu from '../../../components/general/HamburgerMenu'
import MenuItem from '../../../components/general/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '../../../components/general/DeleteConfirmationModal'
import { Link } from 'react-router-dom'

function PhotosAlbumList(): React.ReactElement {
  const {
    setCreateAlbumModalOpen,
    albumList,
    refreshAlbumList,
    refreshPhotos
  } = useContext(PhotosContext)
  const [selectedAlbum, setSelectedAlbum] = useState<IPhotosAlbum | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Photos"
          desc="View and manage all your precious memories."
        />
        <div className="relative mt-6 flex h-full min-h-0 w-full gap-8">
          <PhotosSidebar />
          <div className="flex h-full flex-1 flex-col">
            <div className="mx-4 flex items-center justify-between">
              <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
                Albums{' '}
                <span className="text-base text-bg-400">
                  ({typeof albumList !== 'string' ? albumList.length : '...'})
                </span>
              </h1>
              <button
                onClick={() => {
                  setCreateAlbumModalOpen(true)
                }}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800"
              >
                <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
                <span className="shrink-0">create</span>
              </button>
            </div>
            <div className="mx-4 mt-6 flex items-center gap-4">
              <search className="flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
                <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
                <input
                  type="text"
                  placeholder="Search albums ..."
                  className="w-full bg-transparent placeholder:text-bg-500 focus:outline-none"
                />
              </search>
            </div>
            <APIComponentWithFallback data={albumList}>
              {typeof albumList !== 'string' && (
                <ul className="mx-4 mt-6 grid flex-1 grid-cols-3 overflow-y-auto pb-6">
                  {albumList.map(album => (
                    <li
                      key={album.id}
                      className="relative flex h-min flex-col gap-1 p-4"
                    >
                      <Link
                        to={`/photos/album/${album.id}`}
                        className="absolute left-0 top-0 h-full w-full rounded-md transition-all duration-100 hover:bg-bg-900/[0.03] dark:hover:bg-bg-100/5"
                      />
                      {album.cover ? (
                        <></>
                      ) : (
                        <div className="pointer-events-none relative mb-2 flex h-52 items-center justify-center rounded-lg bg-bg-200 shadow-lg dark:bg-bg-800/50">
                          <Icon
                            icon="tabler:library-photo"
                            className="h-20 w-20 text-bg-400 dark:text-bg-700"
                          />
                        </div>
                      )}
                      <div className="pointer-events-none relative w-full min-w-0">
                        <h2 className="truncate text-lg font-semibold text-bg-800 dark:text-bg-100">
                          {album.name}
                        </h2>
                        <p className="flex items-center gap-2 text-sm text-bg-500">
                          {album.amount.toLocaleString()} photos
                          <Icon
                            icon="tabler:circle-filled"
                            className="h-1 w-1"
                          />
                          {album.is_public ? 'Public' : 'Private'}
                        </p>
                      </div>
                      <HamburgerMenu position="absolute bottom-6 right-4">
                        <MenuItem
                          icon="tabler:pencil"
                          onClick={() => {}}
                          text="Edit"
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
                  ))}
                </ul>
              )}
            </APIComponentWithFallback>
          </div>
        </div>
      </ModuleWrapper>
      <CreateAlbumModal />
      <DeleteConfirmationModal
        apiEndpoint="photos/album/delete"
        data={selectedAlbum}
        closeModal={() => {
          setDeleteModalOpen(false)
        }}
        isOpen={isDeleteModalOpen}
        itemName="album"
        updateDataList={() => {
          refreshAlbumList()
          refreshPhotos()
        }}
        nameKey="name"
        customText="Are you sure you want to delete this album? The photos inside this album will not be deleted."
      />
    </>
  )
}

export default PhotosAlbumList
