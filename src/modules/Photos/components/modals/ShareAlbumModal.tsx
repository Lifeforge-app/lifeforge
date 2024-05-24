import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import { type IPhotosAlbum } from '@typedec/Photos'
import APIRequest from '../../../../utils/fetchData'

const Clipboard = (function (window, document, navigator) {
  let textArea: HTMLTextAreaElement

  function isOS(): RegExpMatchArray | null {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  function createTextArea(text: string): void {
    textArea = document.createElement('textArea') as HTMLTextAreaElement
    textArea.value = text
    document.body.appendChild(textArea)
  }

  function selectText(): void {
    let range, selection

    if (isOS()) {
      range = document.createRange()
      range.selectNodeContents(textArea)
      selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }
  }

  function copyToClipboard(): void {
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  function copy(text: string): void {
    createTextArea(text)
    selectText()
    copyToClipboard()
  }

  return {
    copy
  }
})(window, document, navigator)

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
      successInfo: `Album is now ${!publicity ? 'public' : 'private'}.`,
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
    <div className="p-4">
      <div className="flex items-center justify-between gap-4">
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
              Clipboard.copy(
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
