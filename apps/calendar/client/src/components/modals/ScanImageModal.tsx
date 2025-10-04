import forgeAPI from '@/utils/forgeAPI'
import { Button, FileInput, ModalHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import ModifyEventModal from './ModifyEventModal'

function ScanImageModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const [file, setFile] = useState<File | string | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

  async function handleSubmit() {
    if (file === null) {
      toast.error('Please select a file')

      return
    }

    try {
      const data = await forgeAPI.calendar.events.scanImage.mutate({
        file
      })

      onClose()

      open(ModifyEventModal, {
        type: 'create',
        initialData: {
          ...data,
          type: 'single'
        }
      })
      setFile(null)
      setPreview(null)
      toast.success('Image scanned successfully')
    } catch (error) {
      console.error(error)
      toast.error('Error scanning image')
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  return (
    <>
      <div className="min-w-[50vw]">
        <ModalHeader
          hasAI
          icon="tabler:scan"
          namespace="apps.calendar"
          title="scanImage"
          onClose={onClose}
        />
        <FileInput
          acceptedMimeTypes={{
            images: ['image/jpeg', 'image/png', 'image/jpg'],
            files: ['application/pdf']
          }}
          file={file}
          icon="tabler:photo"
          label="image"
          namespace="apps.calendar"
          preview={preview}
          setData={({ file, preview }) => {
            setFile(file)
            setPreview(preview)
          }}
          onImageRemoved={() => {
            setFile(null)
            setPreview(null)
          }}
        />
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
    </>
  )
}

export default ScanImageModal
