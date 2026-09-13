import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  Button,
  ColorField,
  FormModal,
  TextField,
  createDefaultValues,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { CalendarCalendar } from '../Calendar'
import SubscribeICSModal from './SubscribeICSModal'

const schema = z.object({
  name: z.string().min(1, 'Calendar name is required'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color (e.g. #FF0000)'
    ),
  icsUrl: z.string().optional()
})

function ModifyCalendarModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: CalendarCalendar
  }
  onClose: () => void
}) {
  const { open } = useModalStore()

  const createMutation = useForgeMutation(forgeAPI.calendars.create, {
    action: 'create',
    queryKey: [forgeAPI.calendars.list.key, forgeAPI.events.key],
    onSuccess: () => onClose()
  })

  const updateMutation = useForgeMutation(
    forgeAPI.calendars.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: [forgeAPI.calendars.list.key, forgeAPI.events.key],
      onSuccess: () => onClose()
    }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const icsUrl = form.watch('icsUrl')

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: data => {
          ;(type === 'create' ? createMutation : updateMutation).mutateAsync(
            data
          )
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `calendar.${type}`,
        headerActions:
          type !== 'update' ? (
            <Button
              key="subscribe-ics"
              icon="tabler:calendar-code"
              variant="plain"
              onClick={() =>
                open(SubscribeICSModal, {
                  onSubmit: icsUrl => {
                    form.setValue('icsUrl', icsUrl)
                  }
                })
              }
            />
          ) : undefined,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Calendar name"
        name="name"
        placeholder="Calendar name"
      />
      <ColorField
        required
        control={form.control}
        label="Calendar color"
        name="color"
      />
      {icsUrl && (
        <TextField
          disabled
          control={form.control}
          icon="tabler:link"
          label="ICS URL"
          name="icsUrl"
          placeholder="https://example.com/calendar.ics"
        />
      )}
    </FormModal>
  )
}

export default ModifyCalendarModal
