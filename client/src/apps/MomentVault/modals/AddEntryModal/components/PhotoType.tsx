import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import { Button } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhotoAlbum from 'react-photo-album'
import { toast } from 'react-toastify'

async function getNaturalHeightWidth(file: File) {
  return new Promise<{ height: number; width: number }>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({ height: img.height, width: img.width })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function PhotoType({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('apps.momentVault')

  const [photos, setPhotos] = useState<
    {
      file: File
      preview: string
      height: number
      width: number
    }[]
  >([])

  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    if (!photos.length) {
      toast.error('Please select a photo')

      return
    }

    setSubmitLoading(true)

    try {
      const formData = new FormData()

      formData.append('type', 'photos')
      photos.forEach(photo => {
        formData.append('files', photo.file)
      })

      await forgeAPI.momentVault.entries.create.mutate(formData)

      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create photo entry')
    } finally {
      setSubmitLoading(false)
    }
  }

  function selectPhotos() {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true

    input.style.display = 'none'
    document.body.appendChild(input)

    input.click()

    input.onchange = async () => {
      const files = input.files

      if (files) {
        if (files.length > 25) {
          toast.error('You can only select up to 25 photos')

          return
        }

        const finalPhotos = await Promise.all(
          Array.from(files)
            .slice(0, 25)
            .map(async file => {
              const { height, width } = await getNaturalHeightWidth(file)

              return {
                file,
                preview: URL.createObjectURL(file),
                height,
                width
              }
            })
        )

        setPhotos(finalPhotos)
      }

      document.body.removeChild(input)
    }
  }

  return (
    <>
      <div className="shadow-custom component-bg-lighter flex w-full flex-col rounded-md p-6">
        <div className="text-bg-500 flex items-center gap-3">
          <Icon className="size-6" icon="tabler:photo" />
          <span className="font-medium">
            {t(`inputs.photos`)} <span className="text-red-500">*</span>
          </span>
        </div>
        {photos.length > 0 && (
          <div className="mt-6">
            <PhotoAlbum
              layout="rows"
              photos={photos.map(photo => ({
                src: photo.preview,
                width: photo.width,
                height: photo.height
              }))}
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
        )}
        {photos.length ? (
          <Button
            isRed
            className="mt-6"
            icon="tabler:trash"
            variant="secondary"
            onClick={() => setPhotos([])}
          >
            Clear Photos
          </Button>
        ) : (
          <Button
            className="mt-6"
            icon="tabler:plus"
            namespace="apps.momentVault"
            variant="secondary"
            onClick={selectPhotos}
          >
            Select Photos
          </Button>
        )}
      </div>
      <Button
        className="mt-6 w-full"
        icon="tabler:plus"
        loading={submitLoading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </>
  )
}

export default PhotoType
