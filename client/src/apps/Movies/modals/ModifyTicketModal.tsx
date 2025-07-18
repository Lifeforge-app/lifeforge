import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { DeleteConfirmationModal, FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import {
  IMovieEntry,
  IMovieTicketFormState
} from '@apps/Movies/interfaces/movies_interfaces'

function ModifyTicketModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: IMovieEntry | null
  }
  onClose: () => void
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()
  const [formState, setFormState] = useState<IMovieTicketFormState>({
    entry_id: '',
    ticket_number: '',
    theatre_location: '',
    theatre_number: '',
    theatre_seat: '',
    theatre_showtime: undefined
  })
  const modalRef = useRef<HTMLDivElement | null>(null)

  const FIELDS: IFieldProps<IMovieTicketFormState>[] = [
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

      queryClient.setQueryData<IMovieEntry[]>(
        ['movies', 'entries'],
        oldData => {
          if (!oldData) return oldData
          return oldData.map(entry => {
            if (entry.id === existedData?.id) {
              return {
                ...entry,
                ticket_number: '',
                theatre_location: '',
                theatre_number: '',
                theatre_seat: '',
                theatre_showtime: ''
              }
            }

            return entry
          })
        }
      )

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
        entry_id: existedData.id,
        ticket_number: '',
        theatre_location: '',
        theatre_number: '',
        theatre_seat: '',
        theatre_showtime: undefined
      }))
      return
    }

    if (type === 'update') {
      setFormState({
        entry_id: existedData.id,
        ticket_number: existedData.ticket_number,
        theatre_location: existedData.theatre_location,
        theatre_number: existedData.theatre_number,
        theatre_seat: existedData.theatre_seat,
        theatre_showtime: dayjs(existedData.theatre_showtime).toDate()
      })
    }
  }, [type, existedData])

  function updateDataList(newData: IMovieEntry) {
    queryClient.setQueryData<IMovieEntry[]>(['movies', 'entries'], oldData => {
      if (!oldData) return oldData
      return oldData
        .map(entry => {
          if (entry.id === newData.id) {
            return newData
          }
          return entry
        })
        .sort((a, b) => {
          const aIsWatched = a.is_watched ? 1 : 0
          const bIsWatched = b.is_watched ? 1 : 0
          if (aIsWatched !== bIsWatched) {
            return aIsWatched - bIsWatched
          }
          if (a.ticket_number !== b.ticket_number) {
            return b.ticket_number.localeCompare(a.ticket_number)
          }
          return a.title.localeCompare(b.title)
        })
    })
  }

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
        create: updateDataList,
        update: updateDataList
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
