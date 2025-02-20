import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import { Button } from '@components/buttons'
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
  required,
  namespace
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
  namespace: string
}): React.ReactElement {
  const { t } = useTranslation([namespace, 'common.buttons'])

  return (
    <div className="flex w-full flex-col rounded-md bg-bg-200/50 p-6 shadow-custom dark:bg-bg-800/50">
      <div className="flex items-center gap-4 text-bg-500">
        <Icon className="size-6" icon={icon} />
        <span className="font-medium">
          {t(`${namespace}:inputs.${toCamelCase(name)}`)}{' '}
          {required === true && <span className="text-red-500">*</span>}
        </span>
      </div>
      {preview !== null && (
        <Zoom zoomMargin={100}>
          <img
            alt=""
            className="mx-auto mt-6 max-h-64 rounded-md"
            src={preview}
          />
        </Zoom>
      )}
      {preview !== null && (
        <Button
          isRed
          className="mt-6 w-full"
          icon="tabler:x"
          onClick={() => {
            setPreview(null)
            setImage(null)
            onImageRemoved?.()
          }}
        >
          Remove
        </Button>
      )}
      {image !== null && preview === null && (
        <div className="mt-4 flex items-center justify-between gap-8">
          <p className="w-full truncate">{(image as File).name}</p>
          <Button
            className="p-2!"
            icon="tabler:x"
            variant="no-bg"
            onClick={() => {
              setImage(null)
              onImageRemoved?.()
            }}
          />
        </div>
      )}
      {image === null && preview === null && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            className="w-full"
            icon="tabler:upload"
            variant="secondary"
            onClick={() => {
              setImagePickerModalOpen(true)
            }}
          >
            {t('common.buttons:upload')}
          </Button>
          <p className="text-xs text-bg-500">{reminderText}</p>
        </div>
      )}
    </div>
  )
}

export default ImageAndFileInput
