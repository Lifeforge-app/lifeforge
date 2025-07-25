import dayjs from 'dayjs'
import { Button, ImageAndFileInput, ModalHeader } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import CreateEventModal from './ModifyEventModal/CreateEventModal'

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

    const formData = new FormData()

    formData.append('file', file)

    try {
      const data = await fetchAPI<
        CalendarControllersSchemas.IEvents['scanImage']['response']
      >(import.meta.env.VITE_API_HOST, 'calendar/events/scan-image', {
        method: 'POST',
        body: formData
      })

      onClose()

      open(CreateEventModal, {
        existedData: {
          ...data,
          start: dayjs(data.start).toDate(),
          end: dayjs(data.end).toDate(),
          location: {
            name: data.location || '',
            location: {
              longitude: data.location_coords?.lon || 0,
              latitude: data.location_coords?.lat || 0
            },
            formattedAddress: data.location || ''
          }
        }
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
        <ImageAndFileInput
          acceptedMimeTypes={{
            images: ['image/jpeg', 'image/png', 'image/jpg'],
            files: ['application/pdf']
          }}
          icon="tabler:photo"
          image={file}
          name="image"
          namespace="apps.calendar"
          preview={preview}
          setData={({ image, preview }) => {
            setFile(image)
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
