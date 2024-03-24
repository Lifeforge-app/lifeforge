/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from 'react'
import {
  type IPhotosEntry,
  PhotosContext
} from '../../../providers/PhotosProvider'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Icon } from '@iconify/react/dist/iconify.js'
import Zoom from 'react-medium-image-zoom'
import HamburgerMenu from '../../../components/general/HamburgerMenu'
import MenuItem from '../../../components/general/HamburgerMenu/MenuItem'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import useFetch from '../../../hooks/useFetch'

function forceDown(url: string, filename: string): void {
  fetch(url)
    .then(async function (t) {
      await t.blob().then(b => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        a.setAttribute('download', filename)
        a.click()
      })
    })
    .catch(console.error)
}

function CustomZoomContent({
  img,
  data,
  beingDisplayedInAlbum,
  refreshAlbumData,
  modalState
}: {
  buttonUnzoom: React.ReactElement
  modalState: 'LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED'
  img: any
  data: IPhotosEntry
  beingDisplayedInAlbum: boolean
  refreshAlbumData?: () => void
}): React.ReactElement {
  const { refreshAlbumList } = useContext(PhotosContext)
  const { id: albumId } = useParams<{ id: string }>()
  const [name] = useFetch<string>(
    'photos/entry/name/' + data.id,
    modalState === 'LOADED'
  )

  async function requestDownload(isRaw: boolean): Promise<void> {
    try {
      const { url, fileName } = await fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entry/download/${
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
      }`,
      {
        method: 'PUT',
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
        } catch (error) {
          throw new Error(error as string)
        }
      })
      .catch(error => {
        toast.error('Failed to set thumbnail. Error: ' + error)
      })
  }

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center">
      {img}
      <header className="absolute left-0 top-0 flex w-full items-center justify-between gap-2 p-8">
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
                  <Icon icon="tabler:alert-triangle" className="h-5 w-5" />
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
            position="relative"
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
          <HamburgerMenu lighter position="relative" customWidth="w-56">
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
    </div>
  )
}

function ImageObject({
  photo,
  margin,
  details,
  selected,
  toggleSelected,
  selectedPhotosLength,
  beingDisplayedInAlbum,
  refreshAlbumData
}: {
  photo: any
  details: IPhotosEntry
  margin: string
  selected: boolean
  toggleSelected: (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => void
  selectedPhotosLength: number
  beingDisplayedInAlbum: boolean
  refreshAlbumData?: () => void
}): React.ReactElement {
  const { ready } = useContext(PhotosContext)

  return (
    <div
      onClick={e => {
        if (selectedPhotosLength > 0) {
          toggleSelected(e)
        }
      }}
      style={{
        margin,
        height: photo.height,
        width: photo.width
      }}
      className={`group/image relative h-full w-full min-w-[5rem] overflow-hidden ${
        selected ? 'bg-custom-500/20 p-4' : 'bg-bg-200 dark:bg-bg-800'
      } transition-all ${selectedPhotosLength > 0 && 'cursor-pointer'}`}
    >
      {(ready || beingDisplayedInAlbum) && (
        <>
          <div
            className={`h-full w-full ${
              selectedPhotosLength > 0 ? 'pointer-events-none' : ''
            }`}
          >
            <Zoom
              zoomMargin={100}
              ZoomContent={props => (
                <CustomZoomContent
                  {...props}
                  data={details}
                  beingDisplayedInAlbum={beingDisplayedInAlbum}
                  refreshAlbumData={refreshAlbumData}
                />
              )}
              zoomImg={{
                src: photo.src.split('?')[0]
              }}
            >
              <LazyLoadImage
                alt=""
                src={photo.src}
                className={`relative h-full w-full object-cover ${
                  selected && 'rounded-md'
                }`}
                delayTime={300}
                delayMethod="debounce"
                threshold={50}
                useIntersectionObserver={false}
              />
            </Zoom>
          </div>
          {!selected && (
            <div className="pointer-events-none absolute top-0 h-12 w-full bg-gradient-to-t from-transparent to-black/50 opacity-0 transition-all group-hover/image:opacity-100" />
          )}
          <button
            onClick={toggleSelected}
            className={`group/select-button absolute left-2.5 top-2.5 h-6 w-6 items-center justify-center rounded-full transition-all  ${
              selected
                ? 'flex bg-custom-500 opacity-100'
                : 'hidden bg-bg-200 opacity-50 hover:!bg-bg-100 hover:!opacity-100 group-hover/image:flex'
            }`}
          >
            <Icon
              icon="tabler:check"
              className={`stroke-bg-900 stroke-[2px] text-bg-800 transition-all ${
                !selected &&
                'group-hover/select-button:stroke-bg-900 group-hover/select-button:text-bg-800'
              }`}
            />
          </button>
          <div className="absolute right-2 top-2 flex items-center text-bg-200 opacity-50">
            {details.has_raw && (
              <Icon icon="tabler:letter-r-small" className="h-8 w-8" />
            )}
            {!beingDisplayedInAlbum && details.is_in_album && (
              <Icon icon="tabler:library-photo" className="h-5 w-5" />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageObject
