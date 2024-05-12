/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-undef */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import useFetch from '@hooks/useFetch'
import { PhotosContext } from '@providers/PhotosProvider'

function GalleryHeader(): React.ReactElement {
  const { refreshPhotos, hidePhotosInAlbum, setHidePhotosInAlbum, setReady } =
    useContext(PhotosContext)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [showImportButton, setShowImportButton] = useState(false)
  const [fileImportLoading, setFileImportLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const [ip] = useFetch<string>('projects-k/ip')

  async function importFiles(): Promise<void> {
    setFileImportLoading(true)
    setProgress(0)

    fetch(`${import.meta.env.VITE_API_HOST}/photos/entry/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async response => {
        try {
          const data = await response.json()

          if (response.status !== 202 || data.state !== 'accepted') {
            throw data.message
          }

          const progressFetchInterval = setInterval(async () => {
            const progressData = await fetch(
              `${import.meta.env.VITE_API_HOST}/photos/entry/import/progress`,
              {
                headers: {
                  Authorization: `Bearer ${cookieParse(document.cookie).token}`
                }
              }
            ).then(async response => await response.json())

            setProgress(progressData.data)

            if (progressData.data >= 1) {
              clearInterval(progressFetchInterval)
              setReady(false)
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

  async function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement('textarea')
      textArea.value = text
      // Move textarea out of the viewport so it's not visible
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'

      document.body.prepend(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        textArea.remove()
      }
    }

    setCopiedToClipboard(true)
    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 3000)
  }

  useEffect(() => {
    setShowImportButton(false)

    const progressFetchInterval = setInterval(async () => {
      const progressData = await fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entry/import/progress`,
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
          setReady(false)
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
    <div className="my-8 mr-4 flex flex-col items-center justify-between gap-4 text-bg-500 sm:mr-16 sm:flex-row">
      <div className="flex w-full items-center justify-between">
        <p className="flex items-center gap-2">
          IP Address: {ip}
          <button
            onClick={() => {
              copyToClipboard(ip).catch(e => {
                throw e
              })
            }}
            className="text-bg-500"
          >
            <Icon
              icon={copiedToClipboard ? 'tabler:check' : 'tabler:copy'}
              className="text-base"
            />
          </button>
        </p>
        <HamburgerMenu
          largerPadding
          className="relative z-[9999] block md:hidden"
          customWidth="w-72"
        >
          <MenuItem
            icon="tabler:photo-off"
            onClick={() => {
              setHidePhotosInAlbum(!hidePhotosInAlbum)
            }}
            text="Hide photos in albums"
            isToggled={hidePhotosInAlbum}
          />
          <MenuItem
            icon="tabler:reload"
            onClick={() => {
              refreshPhotos()
            }}
            text="Refresh"
          />
        </HamburgerMenu>
      </div>
      <div className="flex h-14 w-full items-center gap-4 sm:w-auto">
        {showImportButton && (
          <Button
            onClick={() => {
              importFiles().catch(() => {})
            }}
            disabled={fileImportLoading}
            icon={fileImportLoading ? 'svg-spinners:180-ring' : 'tabler:upload'}
          >
            {!fileImportLoading ? (
              <>import</>
            ) : (
              <>
                {progress > 0
                  ? `Importing ${Math.round(progress * 100)}%`
                  : 'Importing'}
              </>
            )}
          </Button>
        )}
        <HamburgerMenu
          largerPadding
          className="relative z-[9999] hidden md:block"
          customWidth="w-72"
        >
          <MenuItem
            icon="tabler:photo-off"
            onClick={() => {
              setHidePhotosInAlbum(!hidePhotosInAlbum)
            }}
            text="Hide photos in albums"
            isToggled={hidePhotosInAlbum}
          />
          <MenuItem
            icon="tabler:reload"
            onClick={() => {
              refreshPhotos()
            }}
            text="Refresh"
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default GalleryHeader
