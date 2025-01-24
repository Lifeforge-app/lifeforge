import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button , Switch } from '@components/buttons'
import { ImageAndFileInput , ImagePickerModal } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
import APIRequest from '@utils/fetchData'

function ScanReceiptModal({
  open,
  setOpen,
  setExistedData,
  setModifyModalOpenType
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletTransaction | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}): React.ReactElement {
  const [file, setFile] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imagePickerModalOpen, setImagePickerModalOpen] = useState(false)
  const [keepReceiptAfterScan, setKeepReceiptAfterScan] = useState(true)
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    if (file === null) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    await APIRequest({
      endpoint: 'wallet/transactions/scan-receipt',
      method: 'POST',
      body: formData,
      isJSON: false,
      failureInfo: 'upload',
      callback(data) {
        setModifyModalOpenType('create')
        setExistedData({
          ...data.data,
          receipt: keepReceiptAfterScan ? file : ''
        })
        setOpen(false)
      },
      finalCallback() {
        setLoading(false)
      }
    })
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
          title="Scan Receipt"
          icon="tabler:scan"
          onClose={() => {
            setOpen(false)
          }}
          hasAI
        />
        <ImageAndFileInput
          icon="tabler:receipt"
          image={file}
          name="receipt"
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
            <Icon icon="tabler:file-check" className="size-5 shrink-0" />
            <span className="w-full min-w-0 truncate">
              Keep receipt after scan
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
          onClick={() => {
            onSubmit().catch(console.error)
          }}
          className="mt-6"
          icon="tabler:arrow-right"
          loading={loading}
          iconAtEnd
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
