import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { usePhotosContext } from '@providers/PhotosProvider'
import GalleryContainer from './Gallery/GalleryContainer'
import GalleryHeader from './Gallery/GalleryHeader'
import AddPhotosToAlbumModal from '../../components/modals/AddPhotosToAlbumModal'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal'
import ImagePreviewModal from '../../components/modals/ImagePreviewModal'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosMainGallery(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const {
    setPhotoDimensions,
    hidePhotosInAlbum,
    setReady,
    setSidebarOpen,
    refreshPhotos,
    imagePreviewModalOpenFor,
    setImagePreviewModalOpenFor
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
      className={
        'absolute top-0 flex size-full min-h-0 flex-1 flex-col pt-8 pl-4 transition-all sm:pl-12'
      }
    >
      <ModuleHeader
        actionButton={
          <button
            className="text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 mr-4 rounded-lg p-4 transition-all lg:hidden"
            onClick={() => {
              setSidebarOpen(true)
            }}
          >
            <Icon className="text-2xl" icon="tabler:menu" />
          </button>
        }
        icon="tabler:camera"
        title="Photos"
      />
      <div className="relative mt-6 flex size-full min-h-0 gap-8">
        <PhotosSidebar />
        <div className="relative flex size-full min-h-0 flex-col gap-8">
          <GalleryHeader />
          <div className="relative flex size-full min-h-0">
            <GalleryContainer />
          </div>
        </div>
      </div>
      <ImagePreviewModal
        // TODO
        // onNextPhoto={() => {}}
        // onPreviousPhoto={() => {}}
        data={imagePreviewModalOpenFor}
        isOpen={imagePreviewModalOpenFor !== null}
        refreshPhotos={refreshPhotos}
        onClose={() => {
          setImagePreviewModalOpenFor(null)
        }}
      />
      <AddPhotosToAlbumModal />
      <ModifyAlbumModal />
      <DeletePhotosConfirmationModal setPhotos={setPhotoDimensions as any} />
    </section>
  ) : (
    <></>
  )
}

export default PhotosMainGallery
