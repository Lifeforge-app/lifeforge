import type { MomentVaultEntry } from '@'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import PhotoAlbum from 'react-photo-album'

import { Card, ContextMenu, ContextMenuItem, Icon } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

dayjs.extend(relativeTime)

async function getNaturalHeightWidth(file: string) {
  return new Promise<{ height: number; width: number }>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({ height: img.height, width: img.width })
    }
    img.onerror = reject
    img.src = file
  })
}

function PhotosEntry({
  entry,
  onDelete
}: {
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const [loading, setLoading] = useState(true)

  const [photos, setPhotos] = useState<
    {
      src: string
      height: number
      width: number
    }[]
  >([])

  useEffect(() => {
    const fetchPhotos = async () => {
      const photos = await Promise.all(
        entry.file!.map(async file => {
          const fileUrl = forgeAPI.getMedia({
            collectionId: entry.collectionId,
            recordId: entry.id,
            fieldId: file
          })

          const { height, width } = await getNaturalHeightWidth(fileUrl)

          return {
            src: fileUrl,
            height,
            width
          }
        })
      )

      setPhotos(photos)
      setLoading(false)
    }

    fetchPhotos()
  }, [entry.file])

  return (
    <Card as="li">
      <div className="flex w-full items-start gap-3">
        {loading ? (
          <div className="flex-center h-96 w-full">
            <div className="loader" />
          </div>
        ) : (
          <>
            <div className="w-full">
              {photos.length > 1 ? (
                <PhotoAlbum
                  layout="rows"
                  photos={photos}
                  // @ts-expect-error - Some issue with the types
                  renderPhoto={({ imageProps }) => (
                    <div style={imageProps.style}>
                      <Zoom zoomMargin={64}>
                        <img
                          alt=""
                          className="h-full w-full rounded-md object-cover"
                          src={imageProps.src}
                        />
                      </Zoom>
                    </div>
                  )}
                  spacing={8}
                />
              ) : (
                <Zoom zoomMargin={64}>
                  <img
                    alt=""
                    className="h-96 rounded-md object-cover"
                    src={photos[0].src}
                  />
                </Zoom>
              )}
            </div>
            <ContextMenu>
              <ContextMenuItem
                dangerous
                icon="tabler:trash"
                label="Delete"
                onClick={onDelete}
              />
            </ContextMenu>
          </>
        )}
      </div>
      <p className="text-bg-500 mt-4 flex items-center gap-2">
        <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
      </p>
    </Card>
  )
}

export default PhotosEntry
