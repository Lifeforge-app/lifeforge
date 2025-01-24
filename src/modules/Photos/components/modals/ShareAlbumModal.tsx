import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import { type IPhotosAlbum } from '@interfaces/photos_interfaces'
import APIRequest from '@utils/fetchData'

function ShareAlbumModal({
  albumId,
  publicity,
  setAlbumData,
  setAlbumList
}: {
  albumId: string
  publicity: boolean
  setAlbumData: React.Dispatch<
    React.SetStateAction<IPhotosAlbum | 'loading' | 'error'>
  >
  setAlbumList: React.Dispatch<
    React.SetStateAction<IPhotosAlbum[] | 'loading' | 'error'>
  >
}): React.ReactElement {
  const [isCopied, setIsCopied] = useState(false)

  async function changePublicity(): Promise<void> {
    setAlbumData(prev => {
      if (prev === 'loading' || prev === 'error') {
        return prev
      }
      return { ...prev, is_public: !publicity }
    })

    await APIRequest({
      endpoint: `photos/album/set-publicity/${albumId}`,
      method: 'POST',
      body: {
        publicity: !publicity
      },
      successInfo: publicity ? 'private' : 'public',
      failureInfo: publicity ? 'private' : 'public',
      onFailure: () => {
        setAlbumData(prev => {
          if (prev === 'loading' || prev === 'error') {
            return prev
          }
          return { ...prev, is_public: publicity }
        })
      },
      callback: () => {
        setAlbumList(prev => {
          if (prev === 'loading' || prev === 'error') {
            return prev
          }
          return prev.map(album => {
            if (album.id === albumId) {
              return { ...album, is_public: !publicity }
            }
            return album
          })
        })
      }
    })
  }

  return (
    <div className="bg-bg-900 p-4">
      <div className="flex-between flex gap-4">
        <div>
          <label htmlFor="isPublic" className="text-bg-500">
            Open to public
          </label>
        </div>
        <Switch
          checked={publicity}
          onClick={() => {
            changePublicity().catch(console.error)
          }}
          className={`${
            publicity ? 'bg-custom-500' : 'bg-bg-300 dark:bg-bg-700/50'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              publicity
                ? 'translate-x-6 bg-bg-100'
                : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
            } inline-block size-4 translate-y-[-0.5px] rounded-full transition`}
          />
        </Switch>
      </div>
      {publicity && (
        <>
          <div className="mt-4 flex gap-2 rounded-md bg-bg-700/50 p-3 text-bg-800 shadow-md dark:text-bg-50">
            <Icon icon="tabler:link" className="size-6" />
            <input
              type="text"
              value={`${
                import.meta.env.VITE_PUBLIC_PORTAL_URL
              }/photos/album/${albumId}`}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <Button
            icon={isCopied ? 'tabler:check' : 'tabler:copy'}
            onClick={() => {
              copy(
                `${
                  import.meta.env.VITE_PUBLIC_PORTAL_URL
                }/photos/album/${albumId}`
              )

              setIsCopied(true)
              setTimeout(() => {
                setIsCopied(false)
              }, 2000)
            }}
            className="mt-2 w-full"
          >
            {isCopied ? 'Copied' : 'Copy link'}
          </Button>
        </>
      )}
    </div>
  )
}

export default ShareAlbumModal
