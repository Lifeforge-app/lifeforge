import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import useFetch from '@hooks/useFetch'
import {
  type IPhotosEntry,
  type IPhotosEntryDimensionsAll,
  type IPhotoAlbumEntryItem
} from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
import forceDown from '@utils/forceDown'
import DeletePhotosConfirmationModal from './DeletePhotosConfirmationModal'

function ImagePreviewModal({
  isOpen,
  onClose,
  img,
  data,
  beingDisplayedInAlbum,
  refreshAlbumData,
  refreshPhotos,
  setPhotos
}: {
  isOpen: boolean
  onClose: () => void
  img: any
  data: IPhotosEntry
  beingDisplayedInAlbum: boolean
  refreshAlbumData?: () => void
  setPhotos:
    | React.Dispatch<React.SetStateAction<IPhotosEntryDimensionsAll>>
    | React.Dispatch<React.SetStateAction<IPhotoAlbumEntryItem[]>>
  refreshPhotos: () => void
}): React.ReactElement {
  const { refreshAlbumList } = usePhotosContext()
  const { id: albumId } = useParams<{ id: string }>()
  const [name] = useFetch<string>(
    `photos/entries/name/${data.id}?isInAlbum=${beingDisplayedInAlbum}`,
    isOpen
  )
  const [deleteConfirmationModalOpen, setDeletePhotosConfirmationModalOpen] =
    useState(false)

  async function requestDownload(isRaw: boolean): Promise<void> {
    try {
      const { url, fileName } = await fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entries/download/${
          data.id
        }?raw=${isRaw}&isInAlbum=${beingDisplayedInAlbum}`,
        {
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      )
        .then(async response => {
          if (response.status !== 200) {
            throw new Error('Failed to get download link.')
          }
          return await response.json()
        })
        .then(data => {
          return data.data
        })
        .catch(error => {
          throw new Error(error as string)
        })

      forceDown(url, fileName)
    } catch (error: any) {
      toast.error(`Failed to get download link. Error: ${error}`)
    }
  }

  function setAsCover(): void {
    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/album/set-cover/${albumId}/${
        data.id
      }?isInAlbum=${beingDisplayedInAlbum}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        try {
          const data = await response.json()

          if (response.status !== 200 || data.state !== 'success') {
            throw data.message
          }
          toast.info('Thumbnail has been set.')
          refreshAlbumList()
          if (refreshAlbumData !== undefined) {
            refreshAlbumData()
          }
          refreshPhotos()
        } catch (error) {
          throw new Error(error as string)
        }
      })
      .catch(error => {
        toast.error('Failed to set thumbnail. Error: ' + error)
      })
  }

  return (
    <>
      <Modal isOpen={isOpen} minWidth="90%" minHeight="90vh">
        <ModalHeader title="Image Preview" onClose={onClose} icon="uil:image" />
        {isOpen && (
          <>
            <header className="flex-between mb-8 flex w-full gap-2">
              {(() => {
                switch (name) {
                  case 'loading':
                    return (
                      <div className="animate-pulse text-lg text-bg-100">
                        Loading...
                      </div>
                    )
                  case 'error':
                    return (
                      <div className="flex items-center gap-2 text-lg text-red-500">
                        <Icon icon="tabler:alert-triangle" className="size-5" />
                        Failed to load image name
                      </div>
                    )
                  default:
                    return <div className="text-lg text-bg-100">{name}</div>
                }
              })()}
              <div className="flex items-center gap-4">
                <HamburgerMenu
                  lighter
                  className="relative"
                  customWidth="w-56"
                  customIcon="tabler:download"
                >
                  {data.has_raw && (
                    <MenuItem
                      icon="tabler:download"
                      onClick={() => {
                        requestDownload(true).catch(console.error)
                      }}
                      text="Download RAW"
                    />
                  )}
                  <MenuItem
                    icon="tabler:download"
                    onClick={() => {
                      requestDownload(false).catch(console.error)
                    }}
                    text="Download JPEG"
                  />
                </HamburgerMenu>
                <button
                  onClick={() => {
                    setDeletePhotosConfirmationModalOpen(true)
                  }}
                  className="rounded-md p-2 text-bg-100 hover:bg-bg-700/50"
                >
                  <Icon icon="tabler:trash" className="size-5" />
                </button>
                <HamburgerMenu lighter className="relative" customWidth="w-56">
                  {beingDisplayedInAlbum && (
                    <MenuItem
                      icon="tabler:album"
                      onClick={setAsCover}
                      text="Set as album cover"
                    />
                  )}
                </HamburgerMenu>
              </div>
            </header>
            <img src={img} alt="" className="h-full object-contain" />
          </>
        )}
      </Modal>
      <DeletePhotosConfirmationModal
        setPhotos={setPhotos}
        isInAlbumGallery={beingDisplayedInAlbum}
        customIsOpen={deleteConfirmationModalOpen}
        customSetIsOpen={setDeletePhotosConfirmationModalOpen}
        customPhotoToBeDeleted={data}
      />
    </>
  )
}

export default ImagePreviewModal
