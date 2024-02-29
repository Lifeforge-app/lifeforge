/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import useFetch from '../../hooks/useFetch'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import moment from 'moment'
import DateGroup from './DateGroup'

export interface IPhotosEntry {
  collectionId: string
  collectionName: string
  created: string
  event: string
  id: string
  image: string
  is_deleted: boolean
  filesize: number
  name: string
  raw: string
  shot_time: string
  updated: string
  width: number
  height: number
}

function Photos(): JSX.Element {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [fileImportLoading, setFileImportLoading] = useState(false)
  const [ip] = useFetch<string>('projects-k/ip')
  const [progress, setProgress] = useState(0)
  const [photos, refreshPhotos] = useFetch<{
    totalItems: number
    items: Record<string, IPhotosEntry[]>
    firstDayOfYear: Record<string, string>
  }>('photos/entry/list')
  const [showImportButton, setShowImportButton] = useState(false)
  const [scrollbarPosition, setScrollbarPosition] = useState(0)
  const [currentDateInViewPort, setCurrentDateInViewPort] = useState<string>('')
  const [firstDayHeight, setFirstDayHeight] = useState<Record<string, number>>(
    {}
  )
  const [timelineSliderMousePosition, setTimelineSliderMousePosition] =
    useState(0)
  const [showTimeLineSlider, setShowTimeLineSlider] = useState(false)
  const [isTimelineSliderMouseDown, setIsTimelineSliderMouseDown] =
    useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (typeof photos !== 'string') {
        const galleryContainerHeight =
          document.getElementById('gallery-container')?.clientHeight
        const wrapperHeight =
          document.getElementById('gallery-wrapper')?.offsetHeight
        setCurrentDateInViewPort(Object.keys(photos.items)[0])

        const firstDayHeight: Record<string, number> = {}

        for (const [year, firstDay] of Object.entries(photos.firstDayOfYear)) {
          console.log(firstDay)
          const element = document.getElementById(firstDay)!
          const { y, height } = element.getBoundingClientRect()
          firstDayHeight[year] =
            Number(((y + height) / galleryContainerHeight!).toPrecision(2)) *
            wrapperHeight!
        }

        setFirstDayHeight(firstDayHeight)
      }
    }, 1000)
  }, [photos])

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
        refreshPhotos()
        setProgress(progressData.data)
      } else {
        setFileImportLoading(false)
        clearInterval(progressFetchInterval)
      }

      setShowImportButton(true)
    }, 1000)

    return () => {
      clearInterval(progressFetchInterval)
    }
  }, [])

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

  return (
    <section className="relative flex min-h-0 w-full">
      <div
        onScroll={e => {
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
          setScrollbarPosition(
            (scrollTop / scrollHeight) * clientHeight -
              (scrollTop / scrollHeight) * 36
          )
        }}
        id="gallery-wrapper"
        className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-4 !pr-16 sm:px-12"
      >
        <ModuleHeader title="Photos" desc="View and manage your photos" />
        <div className="mt-8 flex flex-col items-center  justify-between gap-4 text-bg-500 sm:flex-row">
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
        <APIComponentWithFallback data={photos}>
          {typeof photos !== 'string' && (
            <div id="gallery-container" className="mt-8 flex w-full flex-col">
              {Object.entries(photos.items).map(([date, photos]) => (
                <DateGroup
                  key={date}
                  date={date}
                  photos={photos}
                  setCurrentDateInViewPort={setCurrentDateInViewPort}
                />
              ))}
            </div>
          )}
        </APIComponentWithFallback>
      </div>
      {typeof photos !== 'string' && (
        <div
          onMouseMove={e => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect()
            const mousePosition = Math.round(e.clientY - rect.top)
            setTimelineSliderMousePosition(mousePosition)

            if (isTimelineSliderMouseDown) {
              const galleryContainerHeight =
                document.getElementById('gallery-container')?.clientHeight
              const mousePositionInGalleryContainer =
                (mousePosition / rect.height) * galleryContainerHeight!

              document.getElementById('gallery-wrapper')?.scrollTo({
                top: mousePositionInGalleryContainer,
                behavior: 'smooth'
              })
            }
          }}
          onMouseEnter={() => {
            setShowTimeLineSlider(true)
          }}
          onMouseLeave={() => {
            setShowTimeLineSlider(false)
            setIsTimelineSliderMouseDown(false)
          }}
          onMouseDown={() => {
            setIsTimelineSliderMouseDown(true)
          }}
          onMouseUp={() => {
            setIsTimelineSliderMouseDown(false)
          }}
          onMouseUpCapture={() => {
            setIsTimelineSliderMouseDown(false)
          }}
          onMouseOut={() => {
            setShowTimeLineSlider(false)
            setIsTimelineSliderMouseDown(false)
          }}
          onTouchStart={() => {
            setShowTimeLineSlider(true)
          }}
          onTouchEnd={() => {
            setShowTimeLineSlider(false)
          }}
          onTouchMove={e => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect()
            const mousePosition = Math.round(e.touches[0].clientY - rect.top)
            setTimelineSliderMousePosition(mousePosition)

            const galleryContainerHeight =
              document.getElementById('gallery-container')?.clientHeight
            const mousePositionInGalleryContainer =
              (mousePosition / rect.height) * galleryContainerHeight!

            document.getElementById('gallery-wrapper')?.scrollTo({
              top: mousePositionInGalleryContainer,
              behavior: 'smooth'
            })
          }}
          onTouchCancel={() => {
            setShowTimeLineSlider(false)
          }}
          onClick={e => {
            setShowTimeLineSlider(false)
            const galleryContainerHeight =
              document.getElementById('gallery-container')?.clientHeight
            const rect = (e.target as HTMLDivElement).getBoundingClientRect()
            const mousePosition = Math.round(e.clientY - rect.top)
            const mousePositionInGalleryContainer =
              (mousePosition / rect.height) * galleryContainerHeight!

            document.getElementById('gallery-wrapper')?.scrollTo({
              top: mousePositionInGalleryContainer,
              behavior: 'smooth'
            })
          }}
          className="absolute right-0 top-0 h-full w-16"
        >
          {Object.entries(firstDayHeight).map(([year, height], index) => (
            <span
              key={year}
              className={`pointer-events-none absolute flex h-8 w-full items-center justify-center text-sm text-bg-500 dark:bg-bg-800 ${
                index === 0 && '-translate-y-8'
              }`}
              style={{
                top: `${height}px`
              }}
            >
              {year}
            </span>
          ))}
          {showTimeLineSlider && (
            <div
              className="pointer-events-none absolute h-0.5 w-full bg-custom-500"
              style={{
                top: `${timelineSliderMousePosition}px`
              }}
            ></div>
          )}
        </div>
      )}
      {currentDateInViewPort && (
        <div
          className="pointer-events-none absolute right-3 rounded-t-sm border-b-2 border-custom-500 bg-bg-200 p-2 text-sm dark:bg-bg-800"
          style={{
            top: `${Math.round(scrollbarPosition)}px`
          }}
        >
          {moment(currentDateInViewPort).format('MMM D, YYYY')}
        </div>
      )}
    </section>
  )
}

export default Photos
