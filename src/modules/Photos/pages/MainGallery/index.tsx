import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import { type IPhotosEntryDimensionsAll } from '@interfaces/photos_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { usePhotosContext } from '@providers/PhotosProvider'
import GalleryContainer from './Gallery/GalleryContainer'
import GalleryHeader from './Gallery/GalleryHeader'
import AddPhotosToAlbumModal from '../../components/modals/AddPhotosToAlbumModal'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosMainGallery(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const {
    setPhotoDimensions,
    hidePhotosInAlbum,
    setReady,
    sidebarOpen,
    setSidebarOpen
  } = usePhotosContext()
  const [showGallery, setShowGallery] = useState(true)

  useEffect(() => {
    setShowGallery(false)
    setReady(false)

    const timeout = setTimeout(() => {
      setShowGallery(true)
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [sidebarExpanded])

  useEffect(() => {
    setReady(false)
  }, [hidePhotosInAlbum])

  return showGallery ? (
    <section
      className={`absolute flex transition-all ${
        sidebarOpen
          ? 'top-0 h-full'
          : 'top-24 h-[calc(100%-6rem)] sm:top-32 sm:h-[calc(100%-8rem)]'
      } min-h-0 w-full flex-1 flex-col pl-4 sm:pl-12`}
    >
      <ModuleHeader
        title="Photos"
        desc="View and manage all your precious memories."
        actionButton={
          <button
            onClick={() => {
              setSidebarOpen(true)
            }}
            className="mr-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
          >
            <Icon icon="tabler:menu" className="text-2xl" />
          </button>
        }
      />
      <div className="relative mt-8 flex size-full min-h-0 gap-8">
        <PhotosSidebar />
        <div className="relative flex size-full min-h-0 flex-col gap-8">
          <GalleryHeader />
          <div className="relative flex size-full min-h-0">
            <GalleryContainer />
          </div>
        </div>
      </div>
      <ModifyAlbumModal />
      <AddPhotosToAlbumModal />
      <DeletePhotosConfirmationModal
        setPhotos={
          setPhotoDimensions as React.Dispatch<
            React.SetStateAction<IPhotosEntryDimensionsAll>
          >
        }
      />
    </section>
  ) : (
    <></>
  )
}

export default PhotosMainGallery
