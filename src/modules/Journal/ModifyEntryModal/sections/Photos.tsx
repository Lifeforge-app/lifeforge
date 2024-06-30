import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'

function Photos({
  setStep,
  photos,
  setPhotos
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>
  photos: Array<{
    file: File
    preview: string
    caption: string
  }>
  setPhotos: React.Dispatch<
    React.SetStateAction<
      Array<{
        file: File
        preview: string
        caption: string
      }>
    >
  >
}): React.ReactElement {
  async function uploadPhotos(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const files = e.target.files
    if (files === null) {
      return
    }

    const newPhotos = Array.from(files)
      .slice(0, 10 - photos.length)
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
    if (photos.length >= 10) {
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
      <div className="mt-4 flex w-full flex-1 shrink-0 flex-col rounded-lg bg-bg-800/50 p-6 transition-all focus-within:ring-1 focus-within:ring-bg-500">
        {photos.length > 0 ? (
          <>
            <ul className="w-full divide-y divide-bg-700/50">
              {photos.map((photo, index) => (
                <li key={index} className="flex items-center gap-4 p-4">
                  <img
                    src={photo.preview}
                    alt="Preview"
                    className="size-12 rounded-md"
                  />
                  <input
                    type="text"
                    className="size-full h-12 rounded-md bg-transparent placeholder:text-bg-500"
                    placeholder="Add a caption"
                    value={photo.caption}
                    onChange={e => {
                      const newPhotos = [...photos]
                      newPhotos[index].caption = e.target.value
                      setPhotos(newPhotos)
                    }}
                  />

                  <button
                    onClick={() => {
                      const newPhotos = [...photos]
                      newPhotos.splice(index, 1)
                      setPhotos(newPhotos)
                    }}
                    tabIndex={-1}
                    className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-800 hover:text-red-500"
                  >
                    <Icon icon="tabler:x" className="size-5" />
                  </button>
                </li>
              ))}
            </ul>
            {photos.length < 10 && (
              <Button
                onClick={onUploadClick}
                className="mt-4 w-full"
                disabled={photos.length >= 10}
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
