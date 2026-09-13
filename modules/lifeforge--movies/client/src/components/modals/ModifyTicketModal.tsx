import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  Button,
  ConfirmationModal,
  DateField,
  FormModal,
  LocationField,
  TextField,
  createDefaultValues,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { MovieEntry } from '../..'
import TGVLoginModal, { type TGVImportedTicketData } from './TGVLoginModal'

const schema = z.object({
  ticket_number: z.string().min(1, 'Required'),
  theatre_seat: z.string().catch(''),
  theatre_location: z
    .object({
      name: z.string(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number()
      }),
      formattedAddress: z.string()
    })
    .optional(),
  theatre_showtime: z.string().catch(''),
  theatre_number: z.string().catch('')
})

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
  const { open } = useModalStore()

  const modifyTicketMutation = useMutation(
    forgeAPI.ticket.update
      .input({
        id: initialData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
          })
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.ticket.clear
      .input({
        id: initialData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
          })
          toast.success('Ticket deleted successfully!')
          onClose()
        }
      })
  )

  const handleTicketImport = (ticketData: TGVImportedTicketData) => {
    form.setValue('ticket_number', ticketData.ticket_number)
    form.setValue('theatre_seat', ticketData.theatre_seat)
    form.setValue(
      'theatre_showtime',
      dayjs(ticketData.theatre_showtime).format('YYYY-MM-DDTHH:mm')
    )
    form.setValue('theatre_number', ticketData.theatre_number)
    form.setValue('theatre_location', {
      name: ticketData.theatre_location,
      location: ticketData.theatre_location_coords || {
        latitude: 0,
        longitude: 0
      },
      formattedAddress: ticketData.theatre_location
    })
  }

  const handleDeleteTicket = () =>
    open(ConfirmationModal, {
      title: 'Delete Ticket',
      description: 'Are you sure you want to delete this ticket?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ticket_number: initialData.ticket_number || '',
      theatre_location: initialData.theatre_location
        ? {
            name: initialData.theatre_location || '',
            location: {
              latitude: initialData.theatre_location_coords?.lat || 0,
              longitude: initialData.theatre_location_coords?.lon || 0
            },
            formattedAddress: initialData.theatre_location || ''
          }
        : undefined,
      theatre_number: initialData.theatre_number || '',
      theatre_seat: initialData.theatre_seat || '',
      theatre_showtime: initialData.theatre_showtime
        ? dayjs(initialData.theatre_showtime).format('YYYY-MM-DDTHH:mm')
        : ''
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: modifyTicketMutation.mutateAsync
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.movies',
        title: `ticket.${type}`,
        headerActions: initialData.ticket_number && (
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={handleDeleteTicket}
          />
        ),
        onClose
      }}
    >
      <TextField
        qrScanner
        required
        control={form.control}
        icon="tabler:ticket"
        label="Ticket number"
        name="ticket_number"
        placeholder="123456789"
      />
      <TextField
        control={form.control}
        icon="mdi:love-seat-outline"
        label="Theatre seat"
        name="theatre_seat"
        placeholder="A1"
      />
      <LocationField
        control={form.control}
        label="Theatre location"
        name="theatre_location"
      />
      <DateField
        hasTime
        control={form.control}
        icon="tabler:clock"
        label="Theatre showtime"
        name="theatre_showtime"
      />
      <TextField
        control={form.control}
        icon="tabler:hash"
        label="Theatre number"
        name="theatre_number"
        placeholder="1"
      />
      {initialData.tgv_id && (
        <Button
          icon="tabler:cloud-download"
          mt="md"
          namespace="apps.movies"
          variant="secondary"
          width="100%"
          onClick={() =>
            open(TGVLoginModal, {
              tgvId: initialData.tgv_id,
              onImport: handleTicketImport
            })
          }
        >
          importFromTgv
        </Button>
      )}
    </FormModal>
  )
}

export default ModifyTicketModal
