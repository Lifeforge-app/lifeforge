import { Icon } from '@iconify/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import PhotoAlbum from 'react-photo-album'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

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
  entry: IMomentVaultEntry
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
          const { height, width } = await getNaturalHeightWidth(
            `${import.meta.env.VITE_API_HOST}/media/${file}`
          )

          return {
            src: `${import.meta.env.VITE_API_HOST}/media/${file}`,
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
              <PhotoAlbum
                layout="rows"
                photos={photos}
                renderPhoto={({ imageProps }) => (
                  <img
                    {...imageProps}
                    alt=""
                    className="h-full w-full rounded-md object-cover"
                  />
                )}
                spacing={8}
              />
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
