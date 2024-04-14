/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useState } from 'react'
import ModuleHeader from '@components/ModuleHeader'
import GalleryHeader from './Gallery/GalleryHeader'
import PhotosSidebar from '../../components/PhotosSidebar'
import GalleryContainer from './Gallery/GalleryContainer'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import AddPhotosToAlbumModal from '../../components/modals/AddPhotosToAlbumModal'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal'
import { PhotosContext } from '@providers/PhotosProvider'
import { GlobalStateContext } from '@providers/GlobalStateProvider'

function PhotosMainGallery(): React.ReactElement {
  const { sidebarExpanded } = useContext(GlobalStateContext)
  const { refreshPhotos, hidePhotosInAlbum, setReady } =
    useContext(PhotosContext)
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
    <section className="relative flex h-full min-h-0 w-full flex-1 flex-col pl-4 sm:pl-12">
      <ModuleHeader
        title="Photos"
        desc="View and manage all your precious memories."
      />
      <GalleryHeader />
      <div className="relative flex h-full min-h-0 w-full gap-8">
        <PhotosSidebar />
        <GalleryContainer />
      </div>
      <ModifyAlbumModal />
      <AddPhotosToAlbumModal />
      <DeletePhotosConfirmationModal refreshPhotos={refreshPhotos} />
    </section>
  ) : (
    <></>
  )
}

export default PhotosMainGallery
