/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-undef */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { type IPhotosEntry } from '..'
import useFetch from '../../../hooks/useFetch'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'

function GalleryHeader({
  photos,
  refreshPhotos
}: {
  photos: IPhotosEntry | 'loading' | 'error'
  refreshPhotos: () => void
}): React.ReactElement {
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
              refreshPhotos()
              setFileImportLoading(false)
            }
          }, 1000)
        } catch (error) {
          throw new Error(error as string)
        }
      })
      .catch(error => {
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
          setFileImportLoading(false)
          refreshPhotos()
          clearInterval(progressFetchInterval)
        }
      }

      setShowImportButton(true)
      setIsFirstLoad(false)
    }, 1000)

    return () => {
      clearInterval(progressFetchInterval)
    }
  }, [])

  return (
    <div className="my-8 flex flex-col items-center justify-between gap-4 text-bg-500 sm:flex-row">
      <div className="w-full">
        <p className="flex items-center gap-2">
          Total images:{' '}
          {typeof photos === 'string'
            ? photos
            : photos.totalItems.toLocaleString()}
        </p>
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
      </div>
      {showImportButton && (
        <button
          onClick={() => {
            importFiles().catch(() => {})
          }}
          disabled={fileImportLoading}
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800 sm:w-auto"
        >
          {!fileImportLoading ? (
            <>
              <Icon icon="tabler:upload" className="text-xl" />
              import
            </>
          ) : (
            <>
              <Icon icon="svg-spinners:180-ring" className="text-xl" />
              {progress > 0
                ? `Importing ${Math.round(progress * 100)}%`
                : 'Importing'}
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default GalleryHeader