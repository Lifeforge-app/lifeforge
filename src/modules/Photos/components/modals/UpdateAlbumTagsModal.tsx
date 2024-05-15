/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { PhotosContext } from '@providers/PhotosProvider'
import { type IPhotosAlbum } from '@typedec/Photos'

function UpdateAlbumTagsModal({
  isOpen,
  setOpen,
  selectedAlbum
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
  selectedAlbum: IPhotosAlbum | null
}): React.ReactElement {
  const { albumTagList, setAlbumList, refreshAlbumTagList } =
    useContext(PhotosContext)
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    if (selectedAlbum) {
      setSelectedTags(selectedAlbum.tags)
    }
  }, [selectedAlbum])

  function onSubmitButtonClick(): void {
    setLoading(true)

    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/album/tag/update-album/${
        selectedAlbum?.id
      }`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          tags: selectedTags
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info('Tags updated successfully.')
          setOpen(false)
          setAlbumList(prev => {
            if (typeof prev === 'string') {
              return prev
            }

            return prev.map(album => {
              if (album.id === selectedAlbum?.id) {
                return {
                  ...album,
                  tags: selectedTags
                }
              }

              return album
            })
          })
          refreshAlbumTagList()
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Failed to update tags. Please try again.')
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:tags" className="h-7 w-7" />
          Modify Tags for {selectedAlbum?.name ?? 'Album'}
        </h1>
        {!loading && (
          <button
            onClick={() => {
              setOpen(false)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        )}
      </div>
      <APIComponentWithFallback data={albumTagList}>
        {typeof albumTagList !== 'string' && (
          <div className="flex max-w-[50vw] flex-wrap gap-2">
            {albumTagList.map(tag => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTags(prev => {
                    if (prev.includes(tag.id)) {
                      return prev.filter(id => id !== tag.id)
                    } else {
                      return [...prev, tag.id]
                    }
                  })
                }}
                className={`rounded-full px-4 py-1 uppercase tracking-wider shadow-custom  transition-all ${
                  selectedTags.includes(tag.id)
                    ? 'bg-custom-500/20 text-custom-500 hover:bg-custom-500/40'
                    : 'bg-bg-800 text-bg-500 hover:bg-bg-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
            <button className="rounded-full bg-bg-800 px-4 py-1 uppercase tracking-wider text-bg-500 shadow-custom">
              <Icon icon="tabler:plus" className="h-4 w-4" />
            </button>
          </div>
        )}
      </APIComponentWithFallback>
      <Button
        onClick={onSubmitButtonClick}
        disabled={loading}
        className="mt-12"
        icon={loading ? 'svg-spinners:180-ring' : 'tabler:tags'}
      >
        {!loading && 'Update Tags'}
      </Button>
    </Modal>
  )
}

export default UpdateAlbumTagsModal
