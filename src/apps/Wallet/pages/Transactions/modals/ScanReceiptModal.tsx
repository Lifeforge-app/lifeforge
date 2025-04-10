import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ImageAndFileInput,
  ImagePickerModal,
  ModalHeader,
  ModalWrapper,
  Switch
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import {
  IWalletReceiptScanResult,
  type IWalletTransaction
} from '../../../interfaces/wallet_interfaces'

function ScanReceiptModal({
  open,
  setOpen,
  setExistedData,
  setModifyModalOpenType
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setExistedData: React.Dispatch<
    React.SetStateAction<Partial<IWalletTransaction> | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}) {
  const { t } = useTranslation('apps.wallet')
  const [file, setFile] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imagePickerModalOpen, setImagePickerModalOpen] = useState(false)
  const [keepReceiptAfterScan, setKeepReceiptAfterScan] = useState(true)
  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    if (file === null) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const data = await fetchAPI<IWalletReceiptScanResult>(
        'wallet/transactions/scan-receipt',
        {
          method: 'POST',
          body: formData
        }
      )

      setModifyModalOpenType('create')
      setExistedData({
        ...data,
        receipt: keepReceiptAfterScan ? file : ''
      })
      setOpen(false)
    } catch {
      toast.error('Failed to scan receipt')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setFile(null)
      setPreview(null)
    }
  }, [open])

  return (
    <>
      <ModalWrapper isOpen={open} minWidth="50vw">
        <ModalHeader
          hasAI
          icon="tabler:scan"
          namespace="apps.wallet"
          title="receipts.scan"
          onClose={() => {
            setOpen(false)
            setExistedData(null)
          }}
        />
        <ImageAndFileInput
          icon="tabler:receipt"
          image={file}
          name="receipt"
          namespace="apps.wallet"
          preview={preview}
          setImage={setFile}
          setImagePickerModalOpen={setImagePickerModalOpen}
          setPreview={setPreview}
          onImageRemoved={() => {
            setFile(null)
            setPreview(null)
          }}
        />
        <div className="flex-between mt-4 gap-4">
          <div className="flex w-full min-w-0 items-center gap-2">
            <Icon className="size-5 shrink-0" icon="tabler:file-check" />
            <span className="w-full min-w-0 truncate">
              {t('receipts.keepAfterScan')}
            </span>
          </div>
          <Switch
            checked={keepReceiptAfterScan}
            onChange={() => {
              setKeepReceiptAfterScan(!keepReceiptAfterScan)
            }}
          />
        </div>
        <Button
          iconAtEnd
          className="mt-6"
          icon="tabler:arrow-right"
          loading={loading}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        >
          proceed
        </Button>
      </ModalWrapper>
      <ImagePickerModal
        acceptedMimeTypes={{
          images: ['image/jpeg', 'image/png', 'image/jpg'],
          files: ['application/pdf']
        }}
        isOpen={imagePickerModalOpen}
        onClose={() => {
          setImagePickerModalOpen(false)
        }}
        onSelect={async (file, preview) => {
          setFile(file)
          setPreview(preview)
        }}
      />
    </>
  )
}

export default ScanReceiptModal
