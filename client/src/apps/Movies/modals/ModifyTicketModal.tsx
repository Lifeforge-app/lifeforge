import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import {
  DeleteConfirmationModal,
  type FormFieldConfig,
  FormModal
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import type { MovieEntry } from '..'

function ModifyTicketModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: MovieEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const modifyTicketMutation = useMutation(
    forgeAPI.movies.ticket.update
      .input({
        id: existedData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
        }
      })
  )

  const FIELDS = {
    ticket_number: {
      required: true,
      label: 'Ticket number',
      icon: 'tabler:ticket',
      placeholder: '123456789',
      type: 'text',
      qrScanner: true
    },
    theatre_seat: {
      label: 'Theatre seat',
      icon: 'mdi:love-seat-outline',
      placeholder: 'A1',
      type: 'text'
    },
    theatre_location: {
      label: 'Theatre location',
      type: 'location'
    },
    theatre_showtime: {
      label: 'Theatre showtime',
      icon: 'tabler:clock',
      type: 'datetime',
      hasTime: true
    },
    theatre_number: {
      label: 'Theatre number',
      icon: 'tabler:hash',
      placeholder: '1',
      type: 'text'
    }
  } as const satisfies FormFieldConfig<
    InferInput<typeof forgeAPI.movies.ticket.update>['body']
  >

  async function deleteTicket() {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `/movies/ticket/${existedData.id}`,
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

  const handleDeleteTicket = useCallback(() => {
    open(DeleteConfirmationModal, {
      customOnClick: deleteTicket,
      itemName: 'ticket'
    })
  }, [deleteTicket])

  const onSubmit = useCallback(
    async (data: InferInput<typeof forgeAPI.movies.ticket.update>['body']) => {
      await modifyTicketMutation.mutateAsync(data)

      onClose()
    },
    [type]
  )

  return (
    <FormModal
      actionButton={{
        isRed: true,
        icon: 'tabler:trash',
        onClick: handleDeleteTicket
      }}
      form={{
        fields: FIELDS,
        existedData: {
          ticket_number: existedData.ticket_number || '',
          theatre_location: {
            name: existedData.theatre_location || '',
            location: {
              latitude: existedData.theatre_location_coords?.lat || 0,
              longitude: existedData.theatre_location_coords?.lon || 0
            },
            formattedAddress: existedData.theatre_location || ''
          },
          theatre_number: existedData.theatre_number || '',
          theatre_seat: existedData.theatre_seat || '',
          theatre_showtime: existedData.theatre_showtime
            ? new Date(existedData.theatre_showtime)
            : undefined
        },
        onSubmit
      }}
      submitButton={type}
      ui={{
        title: `ticket.${type}`,
        icon: 'tabler:ticket',
        onClose,
        namespace: 'apps.movies'
      }}
    />
  )
}

export default ModifyTicketModal
