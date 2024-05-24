/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import Modal from '@components/Modals/Modal'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'
import { type IPhotosAlbum } from '@typedec/Photos'
import APIRequest from '@utils/fetchData'

function UpdateAlbumTagsModal({
  isOpen,
  setOpen,
  selectedAlbum
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
  selectedAlbum: IPhotosAlbum | null
}): React.ReactElement {
  const { albumTagList, setAlbumList, refreshAlbumTagList } = usePhotosContext()
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    if (selectedAlbum) {
      setSelectedTags(selectedAlbum.tags)
    }
  }, [selectedAlbum])

  async function onSubmitButtonClick(): Promise<void> {
    setLoading(true)

    await APIRequest({
      endpoint: `photos/album/tag/update-album/${selectedAlbum?.id}`,
      method: 'PATCH',
      body: { tags: selectedTags },
      successInfo: 'Tags updated successfully.',
      failureInfo: 'Failed to update tags. Please try again.',
      callback: () => {
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
      },
      finalCallback: () => {
        setLoading(false)
      }
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
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover: dark:hover:bg-bg-800"
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
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
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
