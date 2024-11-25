/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Icon } from '@iconify/react'
import { parse } from 'file-type-mime'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Zoom from 'react-medium-image-zoom'
import Button from '@components/ButtonsAndInputs/Button'

function ReceiptUploader({
  receipt,
  imagePreviewUrl,
  setImagePreviewUrl,
  setReceipt,
  setToRemoveReceipt,
  openType
}: {
  receipt: File | null
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
    input.accept = 'image/*, application/pdf'
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const buffer = await input.files[0].arrayBuffer()
        const mimeType = parse(buffer)
        if (mimeType?.mime.startsWith('image')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreviewUrl(reader.result as string)
          }
          reader.readAsDataURL(input.files[0])
        }
        setReceipt(input.files[0])
      }
    }

    input.click()
  }

  return (
    <div className="mt-4 w-full rounded-md bg-bg-200/30 p-6 shadow-custom dark:bg-bg-800/50">
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
      {imagePreviewUrl !== null && (
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
      )}
      {receipt !== null && imagePreviewUrl === null && (
        <div className="flex items-center justify-between">
          <p className="mt-6">{receipt.name}</p>
          <Button
            onClick={() => {
              setReceipt(null)
              if (openType === 'update') setToRemoveReceipt(true)
            }}
            className="mt-6"
            variant="no-bg"
            icon="tabler:x"
          />
        </div>
      )}
      {receipt === null && imagePreviewUrl === null && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            onClick={uploadReceipt}
            className="w-full"
            icon="tabler:upload"
            variant="secondary"
          >
            Upload Receipt
          </Button>
          <p className="text-xs text-bg-500">{t('wallet.receiptUploadInfo')}</p>
        </div>
      )}
    </div>
  )
}

export default ReceiptUploader
