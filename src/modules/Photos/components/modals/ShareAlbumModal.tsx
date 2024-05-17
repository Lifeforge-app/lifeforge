/* eslint-disable @typescript-eslint/indent */
import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import { type IPhotosAlbum } from '@typedec/Photos'

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

  function changePublicity(): void {
    setAlbumData(prev => {
      if (prev === 'loading' || prev === 'error') {
        return prev
      }
      return { ...prev, is_public: !publicity }
    })

    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/album/set-publicity/${albumId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          publicity: !publicity
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(`Album is now ${!publicity ? 'public' : 'private'}.`)

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
      })
      .catch(err => {
        console.error(err)
        toast.error('Failed to change publicity.')
        setAlbumData(prev => {
          if (prev === 'loading' || prev === 'error') {
            return prev
          }
          return { ...prev, is_public: publicity }
        })
      })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor="isPublic" className="text-bg-500">
            Open to public
          </label>
        </div>
        <Switch
          checked={publicity}
          onClick={changePublicity}
          className={`${
            publicity ? 'bg-custom-500' : 'bg-bg-300 dark:bg-bg-700/50'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              publicity
                ? 'translate-x-6 bg-bg-100'
                : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
            } inline-block h-4 w-4 rounded-full transition`}
          />
        </Switch>
      </div>
      {publicity && (
        <>
          <div className="mt-4 flex gap-2 rounded-md bg-bg-700/50 p-3 shadow-md">
            <Icon icon="tabler:link" className="h-6 w-6" />
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
              navigator.clipboard
                .writeText(
                  `${
                    import.meta.env.VITE_PUBLIC_PORTAL_URL
                  }/photos/album/${albumId}`
                )
                .then(() => {
                  setIsCopied(true)
                  setTimeout(() => {
                    setIsCopied(false)
                  }, 2000)
                })
                .catch(() => {
                  setIsCopied(false)
                })
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
