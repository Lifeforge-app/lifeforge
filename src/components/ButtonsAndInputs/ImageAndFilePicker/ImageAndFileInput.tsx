import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import Button from '@components/ButtonsAndInputs/Button'
import { toCamelCase } from '@utils/strings'

function ImageAndFileInput({
  icon,
  name,
  reminderText,
  image,
  preview,
  setPreview,
  setImage,
  setImagePickerModalOpen,
  onImageRemoved,
  required
}: {
  icon: string
  name: string
  reminderText?: string
  image: string | File | null
  preview: string | null
  setPreview: (value: string | null) => void
  setImage: (value: string | File | null) => void
  setImagePickerModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  onImageRemoved?: () => void
  required?: boolean
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex w-full flex-col rounded-md bg-bg-200/30 p-6 shadow-custom dark:bg-bg-800/50">
        <div className="flex items-center gap-4 text-bg-500">
          <Icon icon={icon} className="size-6" />
          <span className="font-medium">
            {t(`input.${toCamelCase(name)}`)}{' '}
            {required === true && <span className="text-red-500">*</span>}
          </span>
        </div>
        {preview !== null && (
          <Zoom zoomMargin={100}>
            <img
              src={preview}
              alt=""
              className="mx-auto mt-6 max-h-64 rounded-md"
            />
          </Zoom>
        )}
        {preview !== null && (
          <Button
            onClick={() => {
              setPreview(null)
              setImage(null)
              onImageRemoved?.()
            }}
            className="mt-6 w-full"
            isRed
            icon="tabler:x"
          >
            Remove File
          </Button>
        )}
        {image !== null && preview === null && (
          <div className="mt-4 flex items-center justify-between gap-8">
            <p className="w-full truncate">{(image as File).name}</p>
            <Button
              onClick={() => {
                setImage(null)
                onImageRemoved?.()
              }}
              variant="no-bg"
              className="!p-2"
              icon="tabler:x"
            />
          </div>
        )}
        {image === null && preview === null && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={() => {
                setImagePickerModalOpen(true)
              }}
              className="w-full"
              icon="tabler:upload"
              variant="secondary"
            >
              Upload File
            </Button>
            <p className="text-xs text-bg-500">{reminderText}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ImageAndFileInput
