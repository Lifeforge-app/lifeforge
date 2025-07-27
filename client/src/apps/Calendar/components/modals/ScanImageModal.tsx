import forgeAPI from '@utils/forgeAPI'
import { Button, FileInput, ModalHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ModifyEventModal from './ModifyEventModal'

function ScanImageModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const [file, setFile] = useState<File | string | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    if (file === null) {
      toast.error('Please select a file')

      return
    }
    setLoading(true)

    try {
      const data = await forgeAPI.calendar.events.scanImage.mutate({
        file
      })

      onClose()

      open(ModifyEventModal, {
        type: 'create',
        initialData: data
      })
      setFile(null)
      setPreview(null)
      toast.success('Image scanned successfully')
    } catch (error) {
      console.error(error)
      toast.error('Error scanning image')
    } finally {
      setLoading(false)
    }
  }

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
          name="image"
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
    </>
  )
}

export default ScanImageModal
