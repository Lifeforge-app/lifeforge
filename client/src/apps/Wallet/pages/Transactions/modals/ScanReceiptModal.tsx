import { Icon } from '@iconify/react'
import { Button, ImageAndFileInput, ModalHeader, Switch } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import { WalletControllersSchemas } from 'shared/types/controllers'

import ModifyTransactionsModal from './ModifyTransactionsModal'

function ScanReceiptModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const [file, setFile] = useState<File | string | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

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
      const data = await fetchAPI<
        WalletControllersSchemas.ITransactions['scanReceipt']['response']
      >(import.meta.env.VITE_API_HOST, 'wallet/transactions/scan-receipt', {
        method: 'POST',
        body: formData
      })

      onClose()
      open(ModifyTransactionsModal, {
        type: 'create',
        existedData: {
          ...data,
          type: data.type ?? 'expenses',
          receipt: (keepReceiptAfterScan ? file : '') as never
        }
      })
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
    <div className="min-w-[50vw]">
      <ModalHeader
        hasAI
        icon="tabler:scan"
        namespace="apps.wallet"
        title="receipts.scan"
        onClose={onClose}
      />
      <ImageAndFileInput
        acceptedMimeTypes={{
          images: ['image/jpeg', 'image/png', 'image/jpg'],
          files: ['application/pdf']
        }}
        icon="tabler:receipt"
        image={file}
        name="receipt"
        namespace="apps.wallet"
        preview={preview}
        setData={({ image, preview }) => {
          setFile(image)
          setPreview(preview)
        }}
      />
      <div className="flex-between mt-4 gap-3">
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
        className="mt-6 w-full"
        icon="tabler:arrow-right"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        proceed
      </Button>
    </div>
  )
}

export default ScanReceiptModal
