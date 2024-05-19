/* eslint-disable @typescript-eslint/indent */

import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/ModuleHeader'
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
  const { setPhotoDimensions, hidePhotosInAlbum, setReady } = usePhotosContext()
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
