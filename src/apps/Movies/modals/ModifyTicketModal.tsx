import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import {
  IMovieEntry,
  IMovieTicketFormState
} from '@apps/Movies/interfaces/movies_interfaces'

import fetchAPI from '@utils/fetchAPI'

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
  const close = useModalStore(state => state.close)

  const queryClient = useQueryClient()
  const [formState, setFormState] = useState<IMovieTicketFormState>({
    entry_id: '',
    ticket_number: '',
    theatre_location: '',
    theatre_number: '',
    theatre_seat: '',
    theatre_showtime: ''
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
      hasTime: true,
      index: 0,
      modalRef
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
      await fetchAPI(`/movies/entries/ticket/${existedData?.id}`, {
        method: 'DELETE'
      })

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
      close()

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
        theatre_showtime: ''
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
        theatre_showtime: existedData.theatre_showtime
      })
    }
  }, [type, existedData])

  function updateDataList(newData: IMovieEntry) {
    queryClient.setQueryData<IMovieEntry[]>(['movies', 'entries'], oldData => {
      if (!oldData) return oldData
      return oldData.map(entry => {
        if (entry.id === newData.id) {
          return newData
        }
        return entry
      })
    })
  }

  const handleDeleteTicket = useCallback(() => {
    open('deleteConfirmation', {
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
