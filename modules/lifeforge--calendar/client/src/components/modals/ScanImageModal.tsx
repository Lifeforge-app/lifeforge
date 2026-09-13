import { useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  FileInput,
  ModalHeader,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ModifyEventModal from './ModifyEventModal'

function ScanImageModal({ onClose }: { onClose: () => void }) {
  const { open } = useModalStore()

  const [fileValue, setFileValue] = useState<
    { type: 'empty' } | { type: 'upload'; file: File; preview?: string }
  >({ type: 'empty' })

  async function handleSubmit() {
    if (fileValue.type === 'empty') {
      toast.error('Please select a file')

      return
    }

    try {
      const data = await forgeAPI.events.scanImage.mutate({
        file: fileValue.file
      })

      onClose()

      open(ModifyEventModal, {
        type: 'create',
        initialData: {
          ...data,
          type: 'single'
        }
      })
      setFileValue({ type: 'empty' })
      toast.success('Image scanned successfully')
    } catch (error) {
      console.error(error)
      toast.error('Error scanning image')
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  return (
    <Box minWidth="50vw">
      <ModalHeader
        hasAI
        icon="tabler:scan"
        title="scanImage"
        onClose={onClose}
      />
      <FileInput
        icon="tabler:photo"
        label="image"
        mimeTypes={{
          image: ['jpeg', 'png', 'jpg'],
          application: ['pdf']
        }}
        value={fileValue}
        onChange={value => {
          setFileValue(
            value as
              | { type: 'empty' }
              | { type: 'upload'; file: File; preview?: string }
          )
        }}
      />
      <Button
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={loading}
        mt="lg"
        width="100%"
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        proceed
      </Button>
    </Box>
  )
}

export default ScanImageModal
