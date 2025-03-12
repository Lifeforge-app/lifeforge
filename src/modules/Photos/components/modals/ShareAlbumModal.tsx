import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { useState } from 'react'

import { Button } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

import { type IPhotosAlbum } from '../../interfaces/photos_interfaces'

function ShareAlbumModal({
  albumId,
  publicity,
  setAlbumData,
  setAlbumList
}: {
  albumId: string
  publicity: boolean
  setAlbumData: React.Dispatch<React.SetStateAction<Loadable<IPhotosAlbum>>>
  setAlbumList: React.Dispatch<React.SetStateAction<Loadable<IPhotosAlbum[]>>>
}) {
  const [isCopied, setIsCopied] = useState(false)

  async function changePublicity() {
    setAlbumData(prev => {
      if (prev === 'loading' || prev === 'error') {
        return prev
      }
      return { ...prev, is_public: !publicity }
    })

    try {
      await fetchAPI(`photos/album/set-publicity/${albumId}`, {
        method: 'POST',
        body: {
          publicity: !publicity
        }
      })

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
    } catch {
      setAlbumData(prev => {
        if (prev === 'loading' || prev === 'error') {
          return prev
        }
        return { ...prev, is_public: publicity }
      })
    }
  }

  return (
    <div className="bg-bg-900 p-4">
      <div className="flex-between flex gap-4">
        <div>
          <label className="text-bg-500" htmlFor="isPublic">
            Open to public
          </label>
        </div>
        <Switch
          checked={publicity}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full',
            publicity ? 'bg-custom-500' : 'bg-bg-300 dark:bg-bg-700/50'
          )}
          onClick={() => {
            changePublicity().catch(console.error)
          }}
        >
          <span
            className={clsx(
              'inline-block size-4 translate-y-[-0.5px] rounded-full transition',
              publicity
                ? 'bg-bg-100 translate-x-6'
                : 'bg-bg-100 dark:bg-bg-500 translate-x-1'
            )}
          />
        </Switch>
      </div>
      {publicity && (
        <>
          <div className="bg-bg-700/50 text-bg-800 dark:text-bg-50 mt-4 flex gap-2 rounded-md p-3 shadow-md">
            <Icon className="size-6" icon="tabler:link" />
            <input
              className="focus:outline-hidden w-full bg-transparent"
              type="text"
              value={`${
                import.meta.env.VITE_PUBLIC_PORTAL_URL
              }/photos/album/${albumId}`}
            />
          </div>
          <Button
            className="mt-2 w-full"
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
          >
            {isCopied ? 'Copied' : 'Copy link'}
          </Button>
        </>
      )}
    </div>
  )
}

export default ShareAlbumModal
