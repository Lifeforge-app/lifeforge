/* eslint-disable @typescript-eslint/no-misused-promises */
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import useFetch from '@hooks/useFetch'
import IntervalManager from '../../../utils/intervalManager'

function shortenBigNumber(num: number): string {
  if (num < 1e3) return num.toString()
  if (num >= 1e3 && num < 1e6) return (num / 1e3).toFixed(1) + 'K'
  if (num >= 1e6 && num < 1e9) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e9 && num < 1e12) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
  return num.toString()
}

interface YoutubeVideoInfo {
  title: string
  uploadDate: string
  uploader: string
  duration: string
  viewCount: number
  likeCount: number
  thumbnail: string
}

const intervalManager = IntervalManager.getInstance()

function YoutubeDownloaderModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [videoURLinput, setVideoURLInput] = useState('')
  const videoURL = useDebounce(videoURLinput, 500)
  const URL_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([A-Za-z0-9_-]{11})(\S*)?$/

  const [videoInfo] = useFetch<YoutubeVideoInfo>(
    `/music/youtube/get-info/${videoURL.split('v=')[1]}`,
    URL_REGEX.test(videoURL)
  )

  function updateVideoURL(e: React.ChangeEvent<HTMLInputElement>): void {
    setVideoURLInput(e.target.value)
  }

  async function checkDownloadStatus(): Promise<
    'completed' | 'failed' | 'in_progress'
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/music/youtube/download-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data.status
    }
    return 'failed'
  }

  function downloadVideo(): void {
    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_HOST}/music/youtube/async-download/${
        videoURL.split('v=')[1]
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          metadata: videoInfo
        })
      }
    )
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const success = await checkDownloadStatus()
              switch (success) {
                case 'completed':
                  toast.success('Music downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  onClose()
                  break
                case 'failed':
                  toast.error('Failed to download music!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  break
              }
            }, 3000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          throw new Error(`Failed to download music. Error: ${data.message}`)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download music! Error: ${err}`)
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen} minWidth="40vw">
      <ModalHeader
        title="Download from YouTube"
        icon="tabler:brand-youtube"
        onClose={onClose}
      />
      <Input
        name="Video URL"
        icon="tabler:link"
        value={videoURLinput}
        updateValue={updateVideoURL}
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
      <div className="mt-6 flex w-full gap-6">
        {URL_REGEX.test(videoURL) && (
          <APIComponentWithFallback data={videoInfo}>
            {typeof videoInfo !== 'string' && (
              <>
                <div className="relative w-1/3 overflow-hidden rounded-md border border-bg-800">
                  <img src={videoInfo.thumbnail} className="w-full" />
                  <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-bg-100">
                    {moment
                      .utc(
                        moment
                          .duration(videoInfo.duration, 'seconds')
                          .asMilliseconds()
                      )
                      .format(+videoInfo.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
                  </p>
                </div>
                <div>
                  <h2 className="line-clamp-2 text-2xl font-medium">
                    {videoInfo.title}
                  </h2>
                  <p className="mt-1 text-custom-500">{videoInfo.uploader}</p>
                  <p className="mt-4 text-bg-500">
                    {shortenBigNumber(+videoInfo.viewCount)} views •{' '}
                    {moment(videoInfo.uploadDate, 'YYYYMMDD').fromNow()}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-bg-500">
                    <Icon icon="uil:thumbs-up" />{' '}
                    {shortenBigNumber(+videoInfo.likeCount)} likes
                  </p>
                </div>
              </>
            )}
          </APIComponentWithFallback>
        )}
      </div>
      {typeof videoInfo !== 'string' && (
        <Button
          disabled={loading}
          onClick={downloadVideo}
          icon={loading ? 'svg-spinners:180-ring' : 'tabler:download'}
          className="mt-6"
        >
          {loading ? 'Downloading...' : 'Download'}
        </Button>
      )}
    </Modal>
  )
}
export default YoutubeDownloaderModal
