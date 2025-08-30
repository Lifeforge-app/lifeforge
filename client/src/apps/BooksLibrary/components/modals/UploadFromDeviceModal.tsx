import forgeAPI from '@utils/forgeAPI'
import { Button, FileInput, ModalHeader, useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { usePromiseLoading } from 'shared'

import AddToLibraryModal from './AddToLibraryModal'

function UploadFromDeviceModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const [file, setFile] = useState<File | string | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

  const [loading, uploadFile] = usePromiseLoading(async () => {
    if (!(file instanceof File)) return

    if (file.type !== 'application/epub+zip') {
      onClose()
      open(AddToLibraryModal, {
        provider: 'local',
        book: {
          Title: file.name,
          Size: file.size,
          Extension: file.name.split('.').pop(),
          File: file
        }
      })
    }

    const metadata = await forgeAPI.booksLibrary.entries.getEpubMetadata.mutate(
      {
        file
      }
    )

    onClose()
    open(AddToLibraryModal, {
      book: {
        ...metadata,
        File: file
      },
      provider: 'local'
    })
  })

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:upload"
        namespace="apps.booksLibrary"
        title="Upload From Device"
        onClose={onClose}
      />
      <FileInput
        acceptedMimeTypes={{
          application: ['pdf', 'epub+zip']
        }}
        file={file}
        icon="tabler:book"
        label="Upload Book File"
        preview={preview}
        setData={({ file, preview }) => {
          setFile(file)
          setPreview(preview)
        }}
      />
      <Button
        className="mt-6 w-full"
        disabled={!file}
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={loading}
        onClick={uploadFile}
      >
        Proceed
      </Button>
    </div>
  )
}

export default UploadFromDeviceModal
