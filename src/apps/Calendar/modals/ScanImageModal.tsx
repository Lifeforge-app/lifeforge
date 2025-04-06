import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  ImageAndFileInput,
  ImagePickerModal,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { ICalendarEvent } from '../interfaces/calendar_interfaces'

function ScanImageModal({
  open,
  setOpen,
  setExistedData,
  setModifyModalOpenType
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setExistedData: React.Dispatch<
    React.SetStateAction<Partial<ICalendarEvent> | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}) {
  const [file, setFile] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imagePickerModalOpen, setImagePickerModalOpen] = useState(false)
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
      const data = await fetchAPI<ICalendarEvent>(
        'calendar/events/scan-image',
        {
          method: 'POST',
          body: formData
        }
      )
      setExistedData(data)
      setModifyModalOpenType('create')
      setOpen(false)
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
      <ModalWrapper isOpen={open} minWidth="50vw">
        <ModalHeader
          hasAI
          icon="tabler:scan"
          namespace="apps.calendar"
          title="scanImage"
          onClose={() => {
            setOpen(false)
            setExistedData(null)
          }}
        />
        <ImageAndFileInput
          icon="tabler:photo"
          image={file}
          name="image"
          namespace="apps.calendar"
          preview={preview}
          setImage={setFile}
          setImagePickerModalOpen={setImagePickerModalOpen}
          setPreview={setPreview}
          onImageRemoved={() => {
            setFile(null)
            setPreview(null)
          }}
        />
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

export default ScanImageModal
