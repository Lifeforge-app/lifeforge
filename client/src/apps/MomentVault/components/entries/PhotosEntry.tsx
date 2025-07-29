import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import PhotoAlbum from 'react-photo-album'

import type { MomentVaultEntry } from '@apps/MomentVault'

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
          const fileUrl = forgeAPI.media.input({
            collectionId: entry.collectionId,
            recordId: entry.id,
            fieldId: file
          }).endpoint

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
    <div
      className={clsx(
        'shadow-custom component-bg relative w-full rounded-md p-6'
      )}
    >
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
            <HamburgerMenu>
              <MenuItem
                isRed
                icon="tabler:trash"
                text="Delete"
                onClick={onDelete}
              />
            </HamburgerMenu>
          </>
        )}
      </div>
      <p className="text-bg-500 mt-4 flex items-center gap-2">
        <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
      </p>
    </div>
  )
}

export default PhotosEntry
