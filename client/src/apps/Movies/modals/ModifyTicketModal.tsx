import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { DeleteConfirmationModal, FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import {
  ISchemaWithPB,
  MoviesCollectionsSchemas
} from 'shared/types/collections'
import { MoviesControllersSchemas } from 'shared/types/controllers'

function ModifyTicketModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ISchemaWithPB<MoviesCollectionsSchemas.IEntry> | null
  }
  onClose: () => void
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const [formState, setFormState] = useState<
    MoviesControllersSchemas.ITicket['updateTicket']['body']
  >({
    ticket_number: '',
    theatre_location: {
      name: '',
      location: {
        latitude: 0,
        longitude: 0
      }
    },
    theatre_number: '',
    theatre_seat: '',
    theatre_showtime: ''
  })

  const modalRef = useRef<HTMLDivElement | null>(null)

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'ticket_number',
      required: true,
      label: 'Ticket number',
      icon: 'tabler:ticket',
      placeholder: '123456789',
      type: 'text',
      qrScanner: true
    },
    {
      id: 'theatre_seat',
      label: 'Theatre seat',
      icon: 'mdi:love-seat-outline',
      placeholder: 'A1',
      type: 'text'
    },
    {
      id: 'theatre_location',
      label: 'Theatre location',
      type: 'location'
    },
    {
      id: 'theatre_showtime',
      label: 'Theatre showtime',
      icon: 'tabler:clock',
      type: 'datetime',
      hasTime: true
    },
    {
      id: 'theatre_number',
      label: 'Theatre number',
      icon: 'tabler:hash',
      placeholder: '1',
      type: 'text'
    }
  ]

  async function deleteTicket() {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `/movies/entries/ticket/${existedData?.id}`,
        {
          method: 'DELETE'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['movies', 'entries']
      })

      toast.success('Ticket deleted successfully!')
      onClose()

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch {
      toast.error('Failed to delete ticket')
    }
  }

  useEffect(() => {
    if (!existedData) return

    if (type === 'create') {
      setFormState(prev => ({
        ...prev,
        ticket_number: '',
        theatre_location: {
          name: '',
          location: {
            latitude: 0,
            longitude: 0
          }
        },
        theatre_number: '',
        theatre_seat: '',
        theatre_showtime: ''
      }))

      return
    }

    if (type === 'update') {
      setFormState({
        ticket_number: existedData.ticket_number,
        theatre_location: {
          name: existedData.theatre_location,
          location: {
            latitude: existedData.theatre_location_coords.lat,
            longitude: existedData.theatre_location_coords.lon
          }
        },
        theatre_number: existedData.theatre_number,
        theatre_seat: existedData.theatre_seat,
        theatre_showtime: dayjs(existedData.theatre_showtime).format(
          'YYYY-MM-DD HH:mm'
        )
      })
    }
  }, [type, existedData])

  const handleDeleteTicket = useCallback(() => {
    open(DeleteConfirmationModal, {
      customOnClick: deleteTicket,
      itemName: 'ticket'
    })
  }, [deleteTicket])

  return (
    <FormModal
      actionButtonIsRed
      actionButtonIcon={type === 'update' ? 'tabler:trash' : ''}
      customUpdateDataList={{
        create: () => {
          queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
        },
        update: () => {
          queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
        }
      }}
      data={formState}
      endpoint="/movies/entries/ticket"
      fields={FIELDS}
      icon="tabler:ticket"
      id={existedData?.id}
      modalRef={modalRef}
      namespace="apps.movies"
      openType={type}
      queryKey={['movies', 'entries']}
      setData={setFormState}
      title={`ticket.${type}`}
      onActionButtonClick={handleDeleteTicket}
      onClose={onClose}
    />
  )
}

export default ModifyTicketModal
