import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ConfirmationModal, FormModal, defineForm } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

import type { MovieEntry } from '..'

function ModifyTicketModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData: MovieEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const modifyTicketMutation = useMutation(
    forgeAPI.movies.ticket.update
      .input({
        id: initialData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.movies.ticket.clear
      .input({
        id: initialData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
          toast.success('Ticket deleted successfully!')
          onClose()
        }
      })
  )

  const handleDeleteTicket = () =>
    open(ConfirmationModal, {
      title: 'Delete Ticket',
      description: 'Are you sure you want to delete this ticket?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })

  const { formProps } = defineForm<
    InferInput<typeof forgeAPI.movies.ticket.update>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `ticket.${type}`,
    namespace: 'apps.movies',
    onClose,
    submitButton: type,
    actionButton: {
      dangerous: true,
      icon: 'tabler:trash',
      onClick: handleDeleteTicket
    }
  })
    .typesMap({
      ticket_number: 'text',
      theatre_seat: 'text',
      theatre_location: 'location',
      theatre_showtime: 'datetime',
      theatre_number: 'text'
    })
    .setupFields({
      ticket_number: {
        required: true,
        label: 'Ticket number',
        icon: 'tabler:ticket',
        placeholder: '123456789',
        qrScanner: true
      },
      theatre_seat: {
        label: 'Theatre seat',
        icon: 'mdi:love-seat-outline',
        placeholder: 'A1'
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
        placeholder: '1'
      }
    })
    .initialData({
      ticket_number: initialData.ticket_number || '',
      theatre_location: {
        name: initialData.theatre_location || '',
        location: {
          latitude: initialData.theatre_location_coords?.lat || 0,
          longitude: initialData.theatre_location_coords?.lon || 0
        },
        formattedAddress: initialData.theatre_location || ''
      },
      theatre_number: initialData.theatre_number || '',
      theatre_seat: initialData.theatre_seat || '',
      theatre_showtime: initialData.theatre_showtime
        ? new Date(initialData.theatre_showtime)
        : undefined
    })
    .onSubmit(async data => {
      await modifyTicketMutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTicketModal
