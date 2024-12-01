/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Icon } from '@iconify/react'
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
  openType,
  setIsImagePickerModalOpen
}: {
  receipt: File | null
  imagePreviewUrl: string | null
  setImagePreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  setReceipt: React.Dispatch<React.SetStateAction<File | null>>
  setToRemoveReceipt: React.Dispatch<React.SetStateAction<boolean>>
  openType: 'create' | 'update' | null
  setIsImagePickerModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <>
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
          <div className="mt-4 flex items-center justify-between gap-8">
            <p className="w-full truncate">{receipt.name}</p>
            <Button
              onClick={() => {
                setReceipt(null)
                if (openType === 'update') setToRemoveReceipt(true)
              }}
              variant="no-bg"
              className="!p-2"
              icon="tabler:x"
            />
          </div>
        )}
        {receipt === null && imagePreviewUrl === null && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={() => {
                setIsImagePickerModalOpen(true)
              }}
              className="w-full"
              icon="tabler:upload"
              variant="secondary"
            >
              Upload File
            </Button>
            <p className="text-xs text-bg-500">
              {t('wallet.receiptUploadInfo')}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ReceiptUploader
