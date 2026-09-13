import { useState } from 'react'

import { usePromiseLoading } from '@lifeforge/api'
import {
  Button,
  FileInput,
  ModalHeader,
  Stack,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ModifyBookModal from './ModifyBookModal'

function UploadFromDeviceModal({ onClose }: { onClose: () => void }) {
  const { open } = useModalStore()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(undefined)

  const [loading, uploadFile] = usePromiseLoading(async () => {
    if (!(file instanceof File)) return

    if (
      file.type === 'application/epub+zip' ||
      (file.type === 'application/zip' && file.name.endsWith('.epub'))
    ) {
      const metadata = await forgeAPI.entries.getEpubMetadata.mutate({
        document: file
      })

      onClose()

      open(ModifyBookModal, {
        initialData: {
          ...metadata,
          year_published: Number(metadata.year_published) || 0,
          file: {
            type: 'upload',
            file
          }
        }
      })

      return
    }

    onClose()

    open(ModifyBookModal, {
      initialData: {
        title: file.name,
        file: {
          type: 'upload',
          file
        }
      }
    })
  })

  return (
    <Stack minWidth="50vw">
      <ModalHeader
        icon="tabler:upload"
        title="Upload From Device"
        onClose={onClose}
      />
      <FileInput
        icon="tabler:book"
        label="Upload Book File"
        mimeTypes={{
          application: ['pdf', 'epub+zip']
        }}
        value={
          file
            ? {
                type: 'upload',
                file,
                preview
              }
            : {
                type: 'empty'
              }
        }
        onChange={value => {
          if (value.type === 'upload') {
            setFile(file)
            setPreview(preview)
          } else {
            setFile(null)
            setPreview(undefined)
          }
        }}
      />
      <Button
        disabled={!file}
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={loading}
        mt="lg"
        onClick={uploadFile}
      >
        Proceed
      </Button>
    </Stack>
  )
}

export default UploadFromDeviceModal
