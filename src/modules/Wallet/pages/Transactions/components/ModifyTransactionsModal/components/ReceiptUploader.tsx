/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import Button from '@components/ButtonsAndInputs/Button'

function ReceiptUploader({
  imagePreviewUrl,
  setImagePreviewUrl,
  setReceipt,
  setToRemoveReceipt,
  openType
}: {
  imagePreviewUrl: string | null
  setImagePreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  setReceipt: React.Dispatch<React.SetStateAction<File | null>>
  setToRemoveReceipt: React.Dispatch<React.SetStateAction<boolean>>
  openType: 'create' | 'update' | null
}): React.ReactElement {
  const { t } = useTranslation()
  function uploadReceipt(): void {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(input.files[0])
        setReceipt(input.files[0])
      }
    }

    input.click()
  }

  return (
    <div className="mt-4 w-full rounded-md bg-bg-800/50 p-6">
      <div className="flex items-center gap-4 text-bg-500">
        <Icon icon="tabler:file-text" className="size-6" />
        <span className="font-medium">{t('input.receipt')}</span>
      </div>
      {imagePreviewUrl !== null && (
        <Zoom zoomMargin={100}>
          <img
            src={imagePreviewUrl}
            alt=""
            className="mx-auto mt-6 max-h-64 rounded-md"
          />
        </Zoom>
      )}
      {imagePreviewUrl !== null ? (
        <Button
          onClick={() => {
            setImagePreviewUrl(null)
            setReceipt(null)
            if (openType === 'update') setToRemoveReceipt(true)
          }}
          className="mt-6 w-full"
          isRed
          icon="tabler:x"
        >
          Remove Receipt
        </Button>
      ) : (
        <Button
          onClick={uploadReceipt}
          className="mt-6 w-full"
          icon="tabler:upload"
          variant="secondary"
        >
          Upload Receipt
        </Button>
      )}
    </div>
  )
}

export default ReceiptUploader
