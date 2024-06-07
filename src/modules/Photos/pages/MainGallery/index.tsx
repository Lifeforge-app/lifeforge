import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { usePhotosContext } from '@providers/PhotosProvider'
import { type IPhotosEntryDimensionsAll } from '@typedec/Photos'
import GalleryContainer from './Gallery/GalleryContainer'
import GalleryHeader from './Gallery/GalleryHeader'
import AddPhotosToAlbumModal from '../../components/modals/AddPhotosToAlbumModal'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosMainGallery(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const { setPhotoDimensions, hidePhotosInAlbum, setReady, setSidebarOpen } =
    usePhotosContext()
  const [showGallery, setShowGallery] = useState(true)

  useEffect(() => {
    setShowGallery(false)
    setReady(false)

    const timeout = setTimeout(() => {
      setShowGallery(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [sidebarExpanded])

  useEffect(() => {
    setReady(false)
  }, [hidePhotosInAlbum])

  return showGallery ? (
    <section className="flex size-full min-h-0 flex-1 flex-col pl-4 sm:pl-12">
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
      <GalleryHeader />
      <div className="flex size-full min-h-0 gap-8">
        <PhotosSidebar />
        <div className="relative flex size-full min-h-0">
          <GalleryContainer />
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
