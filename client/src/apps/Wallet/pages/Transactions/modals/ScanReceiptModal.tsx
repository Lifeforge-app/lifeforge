import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import { Button, FileInput, ModalHeader, Switch } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

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

    try {
      const data = await forgeAPI.wallet.transactions.scanReceipt.mutate({
        file
      })

      onClose()
      open(ModifyTransactionsModal, {
        type: 'create',
        initialData: {
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
      <FileInput
        acceptedMimeTypes={{
          images: ['image/jpeg', 'image/png', 'image/jpg'],
          files: ['application/pdf']
        }}
        file={file}
        icon="tabler:receipt"
        label="receipt"
        namespace="apps.wallet"
        preview={preview}
        setData={({ file, preview }) => {
          setFile(file)
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
        className="mt-6 w-full"
        icon="tabler:arrow-right"
        iconPosition="end"
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
