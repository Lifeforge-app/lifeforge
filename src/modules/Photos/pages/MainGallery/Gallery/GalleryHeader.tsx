/* eslint-disable sonarjs/no-nested-functions */
/* eslint-disable sonarjs/no-nested-conditional */

import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { usePhotosContext } from '@providers/PhotosProvider'

function GalleryHeader(): React.ReactElement {
  const { t } = useTranslation('modules.photos')
  const {
    refreshPhotos,
    hidePhotosInAlbum,
    setHidePhotosInAlbum,
    setReady,
    photos
  } = usePhotosContext()

  const [showImportButton, setShowImportButton] = useState(false)
  const [fileImportLoading, setFileImportLoading] = useState(false)
  const [progress, setProgress] = useState<{
    total: number
    done: number
  } | null>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  async function importFiles(): Promise<void> {
    setFileImportLoading(true)
    setProgress(null)

    fetch(`${import.meta.env.VITE_API_HOST}/photos/entries/import`, {
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
              `${import.meta.env.VITE_API_HOST}/photos/entries/import/progress`,
              {
                headers: {
                  Authorization: `Bearer ${cookieParse(document.cookie).token}`
                }
              }
            ).then(async response => await response.json())

            setProgress(progressData.data === 'null' ? null : progressData.data)

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

      if (progressData.data !== 'null') {
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
    <div className="flex-between mr-4 flex flex-col gap-4 sm:mr-16 sm:flex-row">
      <h1 className="shrink-0 text-3xl font-semibold md:text-4xl">
        {t('sidebar.photos.allPhotos')}{' '}
        <span className="text-bg-500 text-base">
          ({typeof photos !== 'string' && photos.totalItems.toLocaleString()})
        </span>
      </h1>
      <div className="flex-between flex w-full">
        <HamburgerMenu
          largerPadding
          className="relative block md:hidden"
          customWidth="w-72"
        >
          {showImportButton && (
            <MenuItem
              disabled={fileImportLoading}
              icon={
                fileImportLoading ? 'svg-spinners:180-ring' : 'tabler:upload'
              }
              text={
                !fileImportLoading
                  ? 'Import photos'
                  : progress !== null
                    ? `Importing ${progress.done.toLocaleString()}/${progress.total.toLocaleString()} (${Math.round(
                        (progress.done / progress.total) * 100
                      )}%)`
                    : 'Importing'
              }
              onClick={() => {
                importFiles().catch(() => {})
              }}
            />
          )}
          <MenuItem
            icon="tabler:photo-off"
            isToggled={hidePhotosInAlbum}
            text="Hide photos in albums"
            onClick={() => {
              setHidePhotosInAlbum(!hidePhotosInAlbum)
            }}
          />
          <MenuItem
            icon="tabler:reload"
            text="Refresh"
            onClick={() => {
              refreshPhotos()
            }}
          />
        </HamburgerMenu>
      </div>
      <div className="hidden h-14 items-center gap-4 sm:flex">
        {showImportButton && (
          <Button
            icon="tabler:upload"
            loading={fileImportLoading}
            onClick={() => {
              importFiles().catch(() => {})
            }}
          >
            {!fileImportLoading ? (
              'import'
            ) : (
              <>
                {progress !== null
                  ? `Importing ${progress.done.toLocaleString()}/${progress.total.toLocaleString()} (${Math.round(
                      (progress.done / progress.total) * 100
                    )}%)`
                  : 'Importing'}
              </>
            )}
          </Button>
        )}
        <HamburgerMenu
          largerPadding
          className="relative z-9989 hidden md:block"
          customWidth="w-72"
        >
          <MenuItem
            icon="tabler:photo-off"
            isToggled={hidePhotosInAlbum}
            text="Hide photos in albums"
            onClick={() => {
              setHidePhotosInAlbum(!hidePhotosInAlbum)
            }}
          />
          <MenuItem
            icon="tabler:reload"
            text="Refresh"
            onClick={() => {
              refreshPhotos()
            }}
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default GalleryHeader
