import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { type IPhotosAlbum } from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
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
      successInfo: 'update',
      failureInfo: 'update',
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
    <ModalWrapper isOpen={isOpen}>
      <div className="flex-between mb-8 flex ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:tags" className="size-7" />
          Modify Tags for {selectedAlbum?.name ?? 'Album'}
        </h1>
        {!loading && (
          <button
            onClick={() => {
              setOpen(false)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        )}
      </div>
      <APIFallbackComponent data={albumTagList}>
        {albumTagList => (
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
              <Icon icon="tabler:plus" className="size-4" />
            </button>
          </div>
        )}
      </APIFallbackComponent>
      <Button
        onClick={() => {
          onSubmitButtonClick().catch(console.error)
        }}
        loading={loading}
        className="mt-12"
        icon="tabler:tags"
      >
        {!loading ? 'Update Tags' : ''}
      </Button>
    </ModalWrapper>
  )
}

export default UpdateAlbumTagsModal
