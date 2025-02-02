import { Icon } from '@iconify/react'
import React from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'

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
      .slice(0, 50 - photos.length)
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
    if (photos.length >= 50) {
      toast.error('You can only upload up to 50 photos')
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = uploadPhotos as any
    input.click()
  }

  const renderContent = () => {
    if (openType === 'update' && originalPhotosLength > 0) {
      return (
        <div className="flex-center size-full flex-col gap-4">
          <Icon className="size-28" icon="tabler:lock" />
          <h2 className="text-4xl font-semibold">Photos are locked</h2>
          <p className="text-center text-lg text-bg-500">
            You can&apos;t upload photos in update mode.
          </p>
        </div>
      )
    }

    if (photos.length === 0) {
      return (
        <EmptyStateScreen
          ctaContent="Upload Photos"
          icon="tabler:photo-off"
          name="photos"
          namespace="modules.journal"
          onCTAClick={onUploadClick}
        />
      )
    }

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {photos.map(photo => (
            <div
              key={photo.preview}
              className="relative max-h-[300px] min-h-32 grow overflow-hidden rounded-lg"
            >
              <img
                alt=""
                className="size-full max-h-[300px] min-h-32 object-cover"
                src={photo.preview}
              />
              <button
                className="flex-center absolute left-0 top-0 size-full bg-red-900/50 opacity-0 transition-opacity duration-200 hover:opacity-100"
                onClick={() => {
                  setPhotos(photos.filter(p => p.preview !== photo.preview))
                }}
              >
                <Icon className="size-6 text-red-500" icon="tabler:trash" />
              </button>
            </div>
          ))}
        </div>
        {photos.length < 50 && (
          <Button
            className="mt-4 w-full"
            disabled={photos.length >= 50}
            icon="tabler:plus"
            variant="secondary"
            onClick={onUploadClick}
          >
            upload photos
          </Button>
        )}
      </>
    )
  }

  return (
    <>
      <div className="mt-4 flex w-full flex-1 shrink-0 flex-col rounded-lg bg-bg-200/50 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-500 dark:bg-bg-800/50">
        {renderContent()}
      </div>
      <div className="flex-between mt-6 flex">
        <Button
          icon="tabler:arrow-left"
          variant="no-bg"
          onClick={() => {
            setStep(3)
          }}
        >
          Previous
        </Button>
        <Button
          iconAtEnd
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(5)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default Photos
