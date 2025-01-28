import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PhotoAlbum from 'react-photo-album'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Button from '@components/buttons/Button/index.tsx'
import GoBackButton from '@components/buttons/GoBackButton.tsx'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem.tsx'
import HamburgerMenu from '@components/buttons/HamburgerMenu/index.tsx'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper.tsx'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback.tsx'
import useFetch from '@hooks/useFetch.ts'
import { type IPhotoAlbumEntryItem } from '@interfaces/photos_interfaces.ts'
import { usePhotosContext } from '../../../../providers/PhotosProvider.tsx'
import BottomBar from '../../components/BottomBar.tsx'

const LLI = LazyLoadImage as any

function LockedFolderGallery(): React.ReactElement {
  const { setSelectedPhotos, setModifyAlbumModalOpenType } = usePhotosContext()
  const navigate = useNavigate()
  const [photos, refreshPhotos] =
    useFetch<IPhotoAlbumEntryItem[]>('photos/locked/list')
  const [showImportButton, setShowImportButton] = useState(false)
  const [fileImportLoading, setFileImportLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  async function importFiles(): Promise<void> {
    setFileImportLoading(true)
    setProgress(0)

    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/entries/import?locked=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        try {
          const data = await response.json()

          if (response.status !== 202 || data.state !== 'accepted') {
            throw data.message
          }

          const progressFetchInterval = setInterval(async () => {
            const progressData = await fetch(
              `${import.meta.env.VITE_API_HOST}/photos/entries/import/progress`,
              {
                headers: {
                  Authorization: `Bearer ${cookieParse(document.cookie).token}`
                }
              }
            ).then(async response => await response.json())

            setProgress(progressData.data)

            if (progressData.data >= 1) {
              clearInterval(progressFetchInterval)
              refreshPhotos()
              setFileImportLoading(false)
            }
          }, 1000)
        } catch (error) {
          throw new Error(error as string)
        }
      })
      .catch(error => {
        setFileImportLoading(false)
        toast.error('Failed to upload files. Error: ' + error)
      })
  }

  useEffect(() => {
    setShowImportButton(false)

    const progressFetchInterval = setInterval(async () => {
      const progressData = await fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entries/import/progress`,
        {
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      ).then(async response => await response.json())

      if (![0, 1].includes(progressData.data)) {
        setFileImportLoading(true)
        setProgress(progressData.data)
      } else {
        if (!isFirstLoad) {
          refreshPhotos()
        }
        setFileImportLoading(false)
        clearInterval(progressFetchInterval)
      }

      setShowImportButton(true)
      setIsFirstLoad(false)
    }, 1000)

    return () => {
      clearInterval(progressFetchInterval)
    }
  }, [])

  return (
    <>
      <div className="relative min-h-0 w-full flex-1 overflow-y-hidden">
        <ModuleWrapper>
          <div className="space-y-1">
            <GoBackButton
              onClick={() => {
                navigate('/photos')
              }}
            />
            <div className="flex-between flex">
              <h1 className="flex items-center gap-4 text-2xl font-semibold">
                <>
                  <div className="flex-center size-14 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                    <Icon icon="tabler:lock" className="size-7" />
                  </div>
                  <span className="space-y-1">
                    Locked Folder
                    {(() => {
                      switch (photos) {
                        case 'loading':
                          return (
                            <span className="text-sm text-bg-500">
                              <Icon
                                icon="svg-spinners:180-ring"
                                className="size-5"
                              />
                            </span>
                          )
                        case 'error':
                          return (
                            <span className="text-sm text-bg-500">Error</span>
                          )
                        default:
                          return (
                            <span className="flex items-center gap-2 text-sm font-medium text-bg-500">
                              {photos.length.toLocaleString()} photos
                            </span>
                          )
                      }
                    })()}
                  </span>
                </>
              </h1>
              <div className="flex-center gap-2">
                {showImportButton && (
                  <Button
                    onClick={() => {
                      importFiles().catch(() => {})
                    }}
                    loading={fileImportLoading}
                    icon="tabler:upload"
                  >
                    {!fileImportLoading ? (
                      <>Import</>
                    ) : (
                      <>
                        {progress > 0
                          ? `Importing ${Math.round(progress * 100)}%`
                          : 'Importing'}
                      </>
                    )}
                  </Button>
                )}
                <HamburgerMenu largerPadding className="relative">
                  <MenuItem
                    icon="tabler:pencil"
                    text="Rename"
                    onClick={() => {
                      setModifyAlbumModalOpenType('rename')
                    }}
                  />
                </HamburgerMenu>
              </div>
            </div>
          </div>
          <div className="relative my-6 w-full flex-1">
            <APIFallbackComponent data={photos}>
              {photos => (
                <PhotoAlbum
                  layout="rows"
                  spacing={8}
                  photos={photos.map(image => ({
                    src: `${import.meta.env.VITE_API_HOST}/media/${
                      image.collectionId
                    }/${image.photoId}/${image.image}?thumb=0x300`,
                    width: image.width / 20,
                    height: image.height / 20,
                    key: image.id
                  }))}
                  renderPhoto={({ imageProps: { src, alt, style } }) => (
                    <LLI
                      src={src}
                      alt={alt}
                      style={style}
                      className="object-cover!"
                    />
                  )}
                />
              )}
            </APIFallbackComponent>
          </div>
        </ModuleWrapper>
        <BottomBar photos={photos as IPhotoAlbumEntryItem[]} inAlbumGallery />
      </div>
    </>
  )
}

export default LockedFolderGallery
