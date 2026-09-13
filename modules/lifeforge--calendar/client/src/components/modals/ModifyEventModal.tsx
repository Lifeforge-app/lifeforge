import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  DateField,
  FormModal,
  ListboxField,
  LocationField,
  RRuleField,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { CalendarEvent } from '../Calendar'

const schema = z.object({
  title: z.string().min(1, 'Event title is required'),
  category: z.string().min(1, 'Category is required'),
  calendar: z.string().min(1, 'Calendar is required'),
  location: z
    .object({
      name: z.string(),
      formattedAddress: z.string(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number()
      })
    })
    .optional(),
  reference_link: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['single', 'recurring']),
  start: z.date().optional(),
  end: z.date().optional(),
  rrule: z.string().optional()
})

function ModifyEventModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<CalendarEvent>
  }
  onClose: () => void
}) {
  const calendarsQuery = useQuery(forgeAPI.calendars.list.queryOptions())
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())

  const createMutation = useForgeMutation(forgeAPI.events.create, {
    action: 'create',
    queryKey: forgeAPI.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.events.update.input({ id: initialData?.id?.split('-')[0] || '' }),
    { action: 'update', queryKey: forgeAPI.key }
  )

  const form = useForm({
    defaultValues: (() => {
      if (!initialData) return createDefaultValues(schema)

      const base: Record<string, unknown> = {
        title: initialData.title,
        category: initialData.category,
        calendar: initialData.calendar,
        location: initialData.location
          ? {
              name: initialData.location || '',
              location: {
                longitude: initialData.location_coords?.lon || 0,
                latitude: initialData.location_coords?.lat || 0
              },
              formattedAddress: initialData.location || ''
            }
          : undefined,
        reference_link: initialData.reference_link,
        description: initialData.description,
        type: initialData.type
      }

      if (initialData.type === 'recurring') {
        base.rrule = initialData.rrule
      } else {
        base.start = initialData.start
          ? dayjs(initialData.start).toDate()
          : undefined
        base.end = initialData.end ? dayjs(initialData.end).toDate() : undefined
      }

      return { ...createDefaultValues(schema), ...base }
    })(),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const eventType = useWatch({ control: form.control, name: 'type' })

  const isRecurring = eventType === 'recurring'

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async data => {
          if (data.type === 'recurring') {
            await (
              type === 'create' ? createMutation : updateMutation
            ).mutateAsync({
              title: data.title!,
              category: data.category!,
              calendar: data.calendar!,
              location: data.location ?? undefined,
              reference_link: data.reference_link ?? '',
              description: data.description ?? '',
              type: 'recurring' as const,
              rrule: data.rrule ?? ''
            })
          } else {
            await (
              type === 'create' ? createMutation : updateMutation
            ).mutateAsync({
              title: data.title!,
              category: data.category!,
              calendar: data.calendar!,
              location: data.location ?? undefined,
              reference_link: data.reference_link ?? '',
              description: data.description ?? '',
              type: 'single' as const,
              start: dayjs(data.start).format('YYYY-MM-DDTHH:mm:ss'),
              end: dayjs(data.end).format('YYYY-MM-DDTHH:mm:ss')
            })
          }
        },
        template: type
      }}
      uiConfig={{
        icon: {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!],
        loading: categoriesQuery.isLoading || calendarsQuery.isLoading,

        title: `event.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Event title"
        name="title"
        placeholder="My event"
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:list"
        label="Event Category"
        name="category"
        options={
          categoriesQuery.isSuccess
            ? categoriesQuery.data?.map(({ name, color, icon, id }) => ({
                value: id,
                text: name,
                icon,
                color
              }))
            : []
        }
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Calendar"
        name="calendar"
        options={
          calendarsQuery.isSuccess
            ? calendarsQuery.data?.map(({ name, color, id }) => ({
                value: id,
                text: name,
                color
              }))
            : []
        }
      />
      <LocationField control={form.control} label="Location" name="location" />
      <TextField
        control={form.control}
        icon="tabler:link"
        label="Reference link"
        name="reference_link"
        placeholder="https://example.com"
      />
      <TextAreaField
        control={form.control}
        icon="tabler:file-text"
        label="Description"
        name="description"
        placeholder="Event description"
      />
      <ListboxField
        required
        control={form.control}
        disabled={type === 'update'}
        icon="tabler:calendar"
        label="Event Type"
        name="type"
        options={[
          {
            value: 'single',
            text: 'Single Event',
            icon: 'tabler:calendar'
          },
          {
            value: 'recurring',
            text: 'Recurring Event',
            icon: 'tabler:repeat'
          }
        ]}
      />
      {isRecurring ? (
        <RRuleField hasDuration control={form.control} name="rrule" />
      ) : (
        <>
          <DateField
            hasTime
            control={form.control}
            icon="tabler:clock"
            label="Start Time"
            name="start"
          />
          <DateField
            hasTime
            control={form.control}
            icon="tabler:clock"
            label="End Time"
            name="end"
          />
        </>
      )}
    </FormModal>
  )
}

export default ModifyEventModal
