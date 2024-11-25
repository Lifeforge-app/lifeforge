import { Icon } from '@iconify/react'
import React from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'

function Photos({
  setStep,
  photos,
  setPhotos,
  openType,
  originalPhotosLength
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  photos: Array<{
    file: File
    preview: string
  }>
  setPhotos: React.Dispatch<
    React.SetStateAction<
      Array<{
        file: File
        preview: string
      }>
    >
  >
  openType: 'create' | 'update' | null
  originalPhotosLength: number
}): React.ReactElement {
  async function uploadPhotos(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const files = e.target.files
    if (files === null) {
      return
    }

    const newPhotos = Array.from(files)
      .slice(0, 25 - photos.length)
      .filter(file => file.type.startsWith('image/'))
      .filter(file => photos.every(p => p.file.name !== file.name))
      .map(async file => {
        return await new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = () => {
            const photo = {
              file,
              preview: reader.result as string,
              caption: ''
            }
            resolve(photo)
          }
          reader.readAsDataURL(file)
        })
      })

    const final = (await Promise.all(newPhotos)) as Array<{
      file: File
      preview: string
      caption: string
    }>

    setPhotos([...photos, ...final])
  }

  function onUploadClick(): void {
    if (photos.length >= 25) {
      toast.error('You can only upload up to 25 photos')
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = uploadPhotos as any
    input.click()
  }

  return (
    <>
      <div className="mt-4 flex w-full flex-1 shrink-0 flex-col rounded-lg bg-bg-200/50 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-500 dark:bg-bg-800/50">
        {openType === 'update' && originalPhotosLength > 0 ? (
          <div className="flex-center flex size-full flex-col gap-4">
            <Icon icon="tabler:lock" className="size-28" />
            <h2 className="text-4xl font-semibold">Photos are locked</h2>
            <p className="text-center text-lg text-bg-500">
              You can&apos;t upload photos in update mode.
            </p>
          </div>
        ) : photos.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {photos.map(photo => (
                <div
                  key={photo.preview}
                  className="relative max-h-[300px] min-h-32 grow overflow-hidden rounded-lg"
                >
                  <img
                    src={photo.preview}
                    alt=""
                    className="size-full max-h-[300px] min-h-32 object-cover"
                  />
                  <button
                    onClick={() => {
                      setPhotos(photos.filter(p => p.preview !== photo.preview))
                    }}
                    className="flex-center absolute left-0 top-0 flex size-full bg-red-900/50 opacity-0 transition-opacity duration-200 hover:opacity-100"
                  >
                    <Icon icon="tabler:trash" className="size-6 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            {photos.length < 25 && (
              <Button
                onClick={onUploadClick}
                className="mt-4 w-full"
                disabled={photos.length >= 25}
                icon="tabler:plus"
                variant="secondary"
              >
                upload photos
              </Button>
            )}
          </>
        ) : (
          <EmptyStateScreen
            icon="tabler:photo-off"
            title="No photos uploaded"
            description="Upload some photos to make your journal entry more memorable!"
            ctaContent="Upload Photos"
            onCTAClick={onUploadClick}
          />
        )}
      </div>
      <div className="flex-between mt-6 flex">
        <Button
          onClick={() => {
            setStep(3)
          }}
          icon="tabler:arrow-left"
          variant="no-bg"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setStep(5)
          }}
          icon="tabler:arrow-right"
          iconAtEnd
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Photos
